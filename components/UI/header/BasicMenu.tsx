import { FC, useState } from 'react';
import Link from 'next/link';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const BasicMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='md:!hidden'>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className='!capitalize !text-white after:ml-1 after:order-solid after:border-t-white after:border-t-[5px] after:border-x-transparent after:border-x-[5px] after:border-b-0'
      >
        Browse
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className='menu'
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Link href='/'>
          <a>
            <MenuItem>Home</MenuItem>
          </a>
        </Link>
        <Link href='/myList'>
          <a>
            <MenuItem>My List</MenuItem>
          </a>
        </Link>
        <Link href='/liked'>
          <a>
            <MenuItem>Liked</MenuItem>
          </a>
        </Link>
        <Link href='/disliked'>
          <a>
            <MenuItem>Disliked</MenuItem>
          </a>
        </Link>
        <Link href='/last-viewed'>
          <a>
            <MenuItem>Last Viewed</MenuItem>
          </a>
        </Link>
      </Menu>
    </div>
  );
};

export default BasicMenu;
