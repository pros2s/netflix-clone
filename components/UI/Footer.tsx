import { FC } from 'react';
import { FaGlobe, FaTelegramPlane } from 'react-icons/fa';
import { SiGithub, SiGmail } from 'react-icons/si';

interface FooterProps {
  isAbsolute?: boolean;
}

const Footer: FC<FooterProps> = ({ isAbsolute }) => {
  return (
    <footer
      className={`${
        isAbsolute && 'md:absolute md:bottom-0'
      } pt-10 pb-6 text-center font-medium space-y-1 text-[#cacaca] transition duration-200 md:hover:text-white`}>
      <p>Alexandr Podoplelov 2022</p>

      <ul className='flex justify-center gap-x-2 cursor-pointer'>
        <li data-text='My Github' className='footerIcon'>
          <a href='https://github.com/pros2s' target='_blank'>
            <SiGithub className='w-5 h-5' />
          </a>
        </li>
        <li data-text='My Portfolio' className='footerIcon'>
          <a href='https://alexandr-portfolio.netlify.app' target='_blank'>
            <FaGlobe className='w-5 h-5' />
          </a>
        </li>
        <li data-text='My Telegram' className='footerIcon'>
          <a href='https://t.me/pros2s' target='_blank'>
            <FaTelegramPlane className='w-5 h-5' />
          </a>
        </li>
        <li data-text='My Gmail' className='footerIcon'>
          <a href='mailto:alexandrpod22@gmail.com' target='_blank'>
            <SiGmail className='w-5 h-5' />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
