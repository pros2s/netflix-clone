import { FC, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Toaster } from 'react-hot-toast';

import { XIcon } from '@heroicons/react/outline';
import MuiModal from '@mui/material/Modal';

import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useFetch } from '../../../hooks/useFetch';

import { closeModal, modalSelector } from '../../../store/slices/modal';
import { movieSelector } from '../../../store/slices/movie';

import ModalBTNs from './ModalBTNs';
import ModalInfo from './ModalInfo';

const Modal: FC = () => {
  const dispatch = useTypedDispatch();
  const { isOpenedModal, isMutedVideo } = useTypedSelector(modalSelector);
  const { movie } = useTypedSelector(movieSelector);

  const [trailer, setTrailer] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const { trailerId } = await useFetch(movie);
      setTrailer(trailerId);
    };

    fetchData();
  }, [movie]);

  return (
    <MuiModal
      className='fixed left-0 right-0 selection:bg-red-600 selection:text-white px-3 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-2xl scrollbar-hide md:!top-7'
      open={isOpenedModal}
      onClose={() => dispatch(closeModal())}
    >
      <>
        <Toaster position='bottom-center' />

        <button
          className='modalButton absolute right-10 top-5 !z-40 h-9 w-9 border-0 bg-[#181818] md:hover:rotate-90 md:hover:bg-[#181818] md:hover:border-2'
          onClick={() => dispatch(closeModal())}
        >
          <XIcon className='h-6 w-6' />
        </button>

        <div className='relative pt-[56.25%]'>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width='100%'
            height='100%'
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
            volume={0.25}
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
            }}
            muted={isMutedVideo}
          />

          <ModalBTNs movie={movie} />
        </div>

        <ModalInfo movie={movie} />
      </>
    </MuiModal>
  );
};

export default Modal;
