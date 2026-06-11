import { DOPLNOVACKY } from '../data/tasks';
import WordFillGame from './WordFillGame';

export default function DoplnovackyGame() {
  return <WordFillGame title="Doplňovačky" gameId="doplnovacky" sourceWords={DOPLNOVACKY} />;
}