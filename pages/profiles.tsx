import Image from 'next/image';
import { FC } from 'react';

import { doggy } from '../utils/icons';

const profiles: FC = () => {
  return <Image src={doggy} />;
};

export default profiles;
