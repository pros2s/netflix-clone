import { FC } from 'react';
import MuiModal from '@mui/material/Modal';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { closeModal, modalSelector } from '../store/slices/modal';

const Modal: FC = () => {
  const dispatch = useTypedDispatch();
  const { isOpenedModal } = useTypedSelector(modalSelector);

  return (
    <MuiModal open={isOpenedModal} onClose={() => dispatch(closeModal())}>
      <p>Modal</p>
    </MuiModal>
  );
};

export default Modal;
