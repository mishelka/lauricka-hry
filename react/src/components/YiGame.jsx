import QuizGame from './QuizGame';
import { YI_TASKS } from '../data/tasks';
import { getBestStars, updateBestStars } from '../utils/player';
import { useState } from 'react';
import { AUDIO_TALES } from '../data/audioTales';

const options = [
  { id: 'tvrde', label: 'Tvrdá Y', className: 'btn-yi-tvrde' },
  { id: 'makke', label: 'Mäkká I', className: 'btn-yi-makke' }
];

export default function YiGame() {
  const [bestStars, setBestStars] = useState(() => getBestStars('yi'));

  return (
    <QuizGame
      title="Mäkká alebo Tvrdá spoluhláska?"
      tasks={YI_TASKS}
      options={options}
      getPrompt={task => task.char}
      getCorrectOption={task => task.type}
      getWrongLabel={task => task.char}
      bestStars={bestStars}
      onResult={stars => setBestStars(updateBestStars('yi', stars))}
      taleUrl={AUDIO_TALES.yi}
    />
  );
}
