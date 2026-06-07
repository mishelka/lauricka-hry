import { useState } from 'react';
import QuizGame from './QuizGame';
import { SLOVA_YI_GROUPS, SLOVA_YI_TASKS } from '../data/tasks';

const options = [
  { id: 'tvrde', label: 'Tvrdé Y', className: 'btn-sl-tvrde' },
  { id: 'makke', label: 'Mäkké I', className: 'btn-sl-makke' }
];

export default function SlovaYiGame() {
  const groups = SLOVA_YI_GROUPS.length > 0 ? SLOVA_YI_GROUPS : [SLOVA_YI_TASKS];
  const [groupIndex, setGroupIndex] = useState(0);

  function nextGroup() {
    setGroupIndex(prev => (prev + 1) % groups.length);
  }

  return (
    <QuizGame
      key={`slova-group-${groupIndex}`}
      title="Doplň správne i/y:"
      tasks={groups[groupIndex]}
      options={options}
      getPrompt={task => task.vypis}
      getCorrectOption={task => task.odpoved}
      getWrongLabel={task => task.cele}
      onCorrectReveal={task => task.cele}
      onRestartGame={nextGroup}
      promptClassName="prompt-words"
    />
  );
}
