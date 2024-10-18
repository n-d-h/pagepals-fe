import { List } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import PropTypes from 'prop-types';

import { useResponsive } from '../../../../components/hooks/use-responsive';
import { CALENDAR_VIEW_OPTIONS } from './CalendarViewOptions';
import Iconify from '../../../../components/iconify';
import { usePopover } from '../../../../components/custom-popover';
import CustomPopover from '../../../../components/custom-popover/custom-popover';

const CalendarToolbar = ({
  date,
  view,
  loading,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilters,
}) => {
  const smUp = useResponsive('up', 'sm');

  const selectedItem = CALENDAR_VIEW_OPTIONS.find(
    (item) => item.value === view,
  );

  const popover = usePopover();

  return (
		<>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{ p: 2.5, pr: 2, position: 'relative' }}
			>
				{smUp && (
					<Button
						size="small"
						color="inherit"
						onClick={popover.onOpen}
						startIcon={<Iconify icon={selectedItem.icon} />}
						endIcon={
							<Iconify icon="eva:arrow-ios-downward-fill" sx={{ ml: -0.5 }} />
						}
					>
						{selectedItem.label}
					</Button>
				)}
				<CustomPopover
					open={popover.open}
					onClose={popover.onClose}
					arrow="top-left"
					sx={{ width: 160 }}
				>
					{CALENDAR_VIEW_OPTIONS.map((viewOption) => (
						<MenuItem
							key={viewOption.value}
							selected={viewOption.value === view}
							onClick={() => {
							  popover.onClose();
							  onChangeView(viewOption.value);
							}}
						>
							<Iconify icon={viewOption.icon} />
							{viewOption.label}
						</MenuItem>
					))}
				</CustomPopover>

				<Stack direction="row" alignItems="center" spacing={1}>
					<IconButton onClick={onPrevDate}>
						<Iconify icon="ic:round-keyboard-arrow-left" width={24} />
					</IconButton>

					<Typography variant="h6" fontWeight={700}>
						{view === 'dayGridMonth'
						  ? moment(date).format('MMMM YYYY')
						  : moment(date).format('LL')}
					</Typography>

					<IconButton onClick={onNextDate}>
						<Iconify icon="ic:round-keyboard-arrow-right" width={24} />
					</IconButton>
				</Stack>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={onToday}>
            <Iconify icon="ic:round-today" width={24} />
          </IconButton>

          <IconButton onClick={onOpenFilters}>
            <Iconify icon="ic:round-filter-list" width={24} />
          </IconButton>
        </Stack>

				{loading && (
					<LinearProgress
						color="inherit"
						sx={{
						  height: 2,
						  width: 1,
						  position: 'absolute',
						  bottom: 0,
						  left: 0,
						}}
					/>
				)}
			</Stack>
		</>
  );
};

CalendarToolbar.propTypes = {
  date: PropTypes.object,
  loading: PropTypes.bool,
  onChangeView: PropTypes.func,
  onNextDate: PropTypes.func,
  onOpenFilters: PropTypes.func,
  onPrevDate: PropTypes.func,
  onToday: PropTypes.func,
  view: PropTypes.oneOf([
    'dayGridMonth',
    'timeGridWeek',
    'timeGridDay',
    'listWeek',
  ]),
};

export default CalendarToolbar;
