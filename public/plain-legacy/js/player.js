class Player {
    constructor(storageKey = 'laurickaPlayerV1') {
        this.storageKey = storageKey;
        this.data = this.load();
        this.migrateLegacyIfNeeded();
    }

    getDefaultData() {
        return {
            games: {},
            migratedLegacyV1: false
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return this.getDefaultData();
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return this.getDefaultData();
            if (!parsed.games || typeof parsed.games !== 'object') parsed.games = {};
            return parsed;
        } catch (e) {
            return this.getDefaultData();
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getGameRecord(gameId) {
        if (!this.data.games[gameId] || typeof this.data.games[gameId] !== 'object') {
            this.data.games[gameId] = { bestStars: 0, levelStars: [] };
        }

        const record = this.data.games[gameId];
        if (!Number.isFinite(record.bestStars)) record.bestStars = 0;
        if (!Array.isArray(record.levelStars)) record.levelStars = [];

        return record;
    }

    clampStars(value) {
        const stars = Number(value);
        if (!Number.isFinite(stars)) return 0;
        return Math.max(0, Math.min(5, Math.floor(stars)));
    }

    getBestStars(gameId) {
        return this.clampStars(this.getGameRecord(gameId).bestStars);
    }

    updateBestStars(gameId, stars) {
        const record = this.getGameRecord(gameId);
        const next = this.clampStars(stars);

        if (next > this.clampStars(record.bestStars)) {
            record.bestStars = next;
            this.save();
        }

        return this.clampStars(record.bestStars);
    }

    getLevelStars(gameId, levelCount) {
        const record = this.getGameRecord(gameId);
        const count = Math.max(0, Number(levelCount) || 0);
        const normalized = new Array(count).fill(0).map((_, i) => this.clampStars(record.levelStars[i]));
        record.levelStars = normalized;
        return normalized;
    }

    updateLevelBestStars(gameId, levelIndex, stars, levelCount) {
        const count = Math.max(0, Number(levelCount) || 0);
        const index = Number(levelIndex);
        if (!Number.isInteger(index) || index < 0 || index >= count) return this.getLevelStars(gameId, count);

        const record = this.getGameRecord(gameId);
        const current = this.getLevelStars(gameId, count);
        const next = this.clampStars(stars);

        if (next > current[index]) {
            current[index] = next;
            record.levelStars = current;
            const best = current.reduce((max, value) => Math.max(max, value), 0);
            record.bestStars = Math.max(this.clampStars(record.bestStars), best);
            this.save();
        }

        return this.getLevelStars(gameId, count);
    }

    mergeLevelStars(gameId, starsArray, levelCount) {
        const count = Math.max(0, Number(levelCount) || 0);
        const base = this.getLevelStars(gameId, count);
        let changed = false;

        for (let i = 0; i < count; i++) {
            const incoming = this.clampStars(Array.isArray(starsArray) ? starsArray[i] : 0);
            if (incoming > base[i]) {
                base[i] = incoming;
                changed = true;
            }
        }

        if (changed) {
            const record = this.getGameRecord(gameId);
            record.levelStars = base;
            const best = base.reduce((max, value) => Math.max(max, value), 0);
            record.bestStars = Math.max(this.clampStars(record.bestStars), best);
            this.save();
        }

        return this.getLevelStars(gameId, count);
    }

    migrateLegacyIfNeeded() {
        if (this.data.migratedLegacyV1) return;

        const yi = this.clampStars(localStorage.getItem('yiBestStarsV1'));
        const obojake = this.clampStars(localStorage.getItem('obojakeBestStarsV1'));

        if (yi > 0) this.updateBestStars('yi', yi);
        if (obojake > 0) this.updateBestStars('obojake', obojake);

        try {
            const slovaLegacyRaw = localStorage.getItem('slovaYiLevelStarsV1');
            if (slovaLegacyRaw) {
                this.mergeLevelStars('slovaYi', JSON.parse(slovaLegacyRaw), 8);
            }
        } catch (e) {
            // Ignore malformed legacy value.
        }

        try {
            const slovaStateRaw = localStorage.getItem('slovaYiGameStateV1');
            if (slovaStateRaw) {
                const parsed = JSON.parse(slovaStateRaw);
                if (parsed && Array.isArray(parsed.levelStars)) {
                    this.mergeLevelStars('slovaYi', parsed.levelStars, 8);
                }
            }
        } catch (e) {
            // Ignore malformed legacy value.
        }

        this.data.migratedLegacyV1 = true;
        this.save();
    }
}

window.Player = Player;
window.PLAYER = new Player();
