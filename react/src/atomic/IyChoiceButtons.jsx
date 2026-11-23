import { getVybraneOptions } from '../utils/gameUtils';

export default function IyChoiceButtons({
  task,
  options,
  onCheck,
  disabledOptions = new Set(),
  feedbackMap = {},
  className = 'button-grid-2x2'
}) {
  const resolvedOptions = options || getVybraneOptions(task);

  const isDisabled = (optionId) => {
    if (!disabledOptions) return false;
    if (disabledOptions instanceof Set) {
      return disabledOptions.has(optionId);
    }
    if (Array.isArray(disabledOptions)) {
      return disabledOptions.includes(optionId);
    }
    return Boolean(disabledOptions);
  };

  return (
    <div className={className}>
      {resolvedOptions.map(option => {
        const marker = feedbackMap ? feedbackMap[option.id] : null;
        const icon = marker === 'correct' ? '✅' : marker === 'wrong' ? '❌' : null;

        return (
          <button
            key={option.id}
            type="button"
            className={option.className}
            onClick={() => onCheck && onCheck(option.id)}
            disabled={isDisabled(option.id)}
          >
            {option.label}
            {marker && <span className="icon">{icon}</span>}
          </button>
        );
      })}
    </div>
  );
}
