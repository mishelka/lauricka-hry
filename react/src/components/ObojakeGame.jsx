import QuizGame from './QuizGame';
import { OBOJAKE_TASKS } from '../data/tasks';
import { useState } from 'react';
import { getBestStars, updateBestStars } from '../utils/player';

const options = [
  { id: 'tvrde', label: 'Tvrdá Y', className: 'btn-ob-tvrde' },
  { id: 'makke', label: 'Mäkká I', className: 'btn-ob-makke' },
  { id: 'obojake', label: 'Obojaká', className: 'btn-ob-obojake' }
];

export default function ObojakeGame() {
  const [bestStars, setBestStars] = useState(() => getBestStars('obojake'));

  return (
    <QuizGame
      title="Aká je to spoluhláska?"
      tasks={OBOJAKE_TASKS}
      options={options}
      getPrompt={task => task.char}
      getCorrectOption={task => task.type}
      getWrongLabel={task => task.char}
      bestStars={bestStars}
      onResult={stars => setBestStars(updateBestStars('obojake', stars))}
    />
  );
}
