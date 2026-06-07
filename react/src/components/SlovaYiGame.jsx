import QuizGame from './QuizGame';
import { SLOVA_YI_TASKS } from '../data/tasks';

const options = [
  { id: 'tvrde', label: 'Tvrdé Y', className: 'btn-sl-tvrde' },
  { id: 'makke', label: 'Mäkké I', className: 'btn-sl-makke' }
];

export default function SlovaYiGame() {
  return (
    <QuizGame
      title="Doplň správne i/y:"
      tasks={SLOVA_YI_TASKS}
      options={options}
      getPrompt={task => task.vypis}
      getCorrectOption={task => task.odpoved}
      getWrongLabel={task => task.cele}
      onCorrectReveal={task => task.cele}
      promptClassName="prompt-words"
    />
  );
}
