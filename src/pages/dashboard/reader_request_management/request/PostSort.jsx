import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Iconify from '../../../../components/iconify';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';

// ----------------------------------------------------------------------

export default function PostSort({ sort, sortOptions, onSort }) {
  const popover = usePopover();

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize' }}
      >
        Sort By:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {sort}
        </Box>
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={sort === option.value}
            onClick={() => {
              popover.onClose();
              onSort(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

PostSort.propTypes = {
  onSort: PropTypes.func,
  sort: PropTypes.string,
  sortOptions: PropTypes.array,
};
