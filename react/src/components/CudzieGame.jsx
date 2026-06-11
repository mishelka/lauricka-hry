import { POZOR } from '../data/tasks';
import WordFillGame from './WordFillGame';

export default function CudzieGame() {
  return <WordFillGame title="Cudzie" gameId="cudzie" sourceWords={POZOR} />;
}
