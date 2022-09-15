import { FC, Dispatch, SetStateAction } from 'react';
import { ChevronLeftIcon, InformationCircleIcon } from '@heroicons/react/outline';

interface RightBTNsProps {
  handleModal: () => void;
  setIsShowInfo: Dispatch<SetStateAction<boolean>>;
  isShowInfo: boolean;
  index: number | undefined;
  rowLength: number | undefined;
}

const RightBTNs: FC<RightBTNsProps> = ({
  handleModal,
  setIsShowInfo,
  isShowInfo,
  index,
  rowLength,
}) => {
  return (
    <div className='flex ml-[60px]'>
      <button data-text='More info' className='moreInfoButton' onClick={handleModal}>
        <InformationCircleIcon />
      </button>

      <button
        data-text={`${isShowInfo ? 'Hide release date & genres' : 'Show release date & genres'}`}
        className={`dropDownButton ${index === rowLength! - 1 && 'md:hover:after:-left-[170px]'}`}
        onClick={() => setIsShowInfo((state) => !state)}
      >
        <ChevronLeftIcon
          className={`transition duration-200 ${isShowInfo ? 'rotate-90' : '-rotate-90'}`}
        />
      </button>
    </div>
  );
};

export default RightBTNs;
