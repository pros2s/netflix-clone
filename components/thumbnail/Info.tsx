import { FC } from 'react';
import { DocumentData } from 'firebase/firestore';

import { Movie } from '../../types';

interface InfoProps {
  isShowInfo: boolean;
  isPlay: boolean;
  movie: Movie | DocumentData | null;
}

const Info: FC<InfoProps> = ({ isPlay, isShowInfo, movie }) => {
  return (
    <ul className='absolute top-[31px] flex items-center space-x-2 text-[10px]'>
      {isShowInfo && (
        <li className='font-semibold text-green-400 transition duration-300'>
          {(movie!.vote_average * 10).toFixed(2)}% Match
        </li>
      )}

      {isShowInfo && (
        <li className='font-light text-[#ebebeb] transition duration-300'>
          {movie?.release_date || movie?.first_air_date}
        </li>
      )}

      <li className='flex mt-0 h-3 items-center justify-center rounded border border-white/40 px-1.5 leading-3 text-[9px] font-light'>
        HD
      </li>

      {!isPlay && (
        <p className='leading-3 text-white/70 text-[9px] font-light'>keep hovering to play</p>
      )}
    </ul>
  );
};

export default Info;
