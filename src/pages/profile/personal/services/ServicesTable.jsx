import PropTypes from 'prop-types';

import { useMutation } from '@apollo/client';
import {
	Button,
	Rating,
	TableHead,
	TextField
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import { usePopover } from '../../../../components/custom-popover';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label/label';
import { paths } from '../../../../components/router/paths';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../components/table';
import { deleteServiceMutation, forceDeleteServiceMutation } from '../../../../services/apolo/mutations';
import { ProfileServiceContext } from './ProfileServiceContext';
import ServiceForm from './ServiceForm';

// ----------------------------------------------------------------------

export default function ServicesTable({
	title,
	subheader,
	tableLabels,
	tableData,
	handleChangeSearch,
	searchValue,
	readerServicesLoading,
	refetchReaderServices,
	...other
}) {
	const [openDialog, closeDialog] = useDialog();

	const handleAddService = () => {
		const callBackDialog = () => {
			closeDialog();
		};

		openDialog({
			fullWidth: true,
			children: (
				<ContentDialog
					title="Service"
					form={ServiceForm}
					callbackFnc={callBackDialog}
					assetForm={{
						closeDialog,
						refetchReaderServices,
					}}
					showActions={false}
				/>
			),
		});
	};

	const [search, setSearch] = useState(searchValue);
	const navigate = useNavigate();

	const getOptionsDelayed = useCallback(
		_.debounce((text, callback) => {
			callback(text);
		}, 500),
		[],
	);

	const handleChangeValueSearch = (e) => {
		setSearch(e.target.value);
		getOptionsDelayed(e.target.value, (_searchValue) => {
			handleChangeSearch(_searchValue);
		});
	};

	return (
		<Card {...other}>
			<CardHeader
				title={title}
				subheader={subheader}
				sx={{ mb: 3 }}
				action={
					<Button
						variant="outlined"
						size="small"
						color="primary"
						onClick={() => { navigate(paths.main.createService); }}
						startIcon={<Iconify icon="bx:bx-plus" />}
					>
						Add Service
					</Button>
				}
			/>

			<TableContainer sx={{ overflowY: 'scroll', maxHeight: '58vh', }}>
				<Scrollbar>
					<Table sx={{ minWidth: 720 }}>
						<TableHead>
							<TableRow>
								<TableCell>
									<TextField
										fullWidth
										size="small"
										placeholder="Search book"
										value={search}
										onChange={handleChangeValueSearch}
										InputProps={{
											endAdornment: readerServicesLoading
												? (
													<Iconify icon="eos-icons:loading" />
												)
												: (
													<Iconify icon="bx:bx-search" />
												),
										}}
									/>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableHeadCustom headLabel={tableLabels} />

						<TableBody>
							{tableData.map((row) => (
								<ServicesRow key={row.book.id} row={row} refetchReaderServices={refetchReaderServices} />
							))}
						</TableBody>
					</Table>
				</Scrollbar>
			</TableContainer>
		</Card>
	);
}

ServicesTable.propTypes = {
	subheader: PropTypes.string,
	tableData: PropTypes.array,
	tableLabels: PropTypes.array,
	title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ServicesRow({ row, refetchReaderServices }) {
	const theme = useTheme();
	const navigate = useNavigate();

	const {
		setLoading,
	} = useContext(
		ProfileServiceContext,
	);

	const lightMode = theme.palette.mode === 'light';

	const popover = usePopover();

	const [deleteService, { loading: deleteLoading }] = useMutation(
		deleteServiceMutation,
		{
			onCompleted: () => {
				showNotification('success', 'Service deleted successfully');
			},
			onError: () => {
				handleForceDelete();
			},
		},
	);

	const [openDialog, closeDialog] = useDialog();
	const handleDelete = () => {
		openDeleteDialog({
			title: 'Delete Service',
			content: 'Are you sure you want to delete this service?',
			dialog: [openDialog, closeDialog],
			dialogProps: {
				buttonStyle: {
					primary: true,
					variant: 'contained',
				},
			},
		}).then((result) => {
			if (result) {
				deleteService({
					variables: {
						id: row.id,
					},
				}).then((result) => {
					refetchReaderServices();
				});
			}
		});
	};

	const [forceDeleteService, { loading: forceDeleteLoading }] = useMutation(
		forceDeleteServiceMutation,
		{
			onCompleted: () => {
				showNotification('success', 'Service deleted successfully');
			},
			onError: (e) => {
				handleFriendlyError(e, 'Failed to delete service');
			},
		},
	);

	const [openForceDeleteDialog, closeForceDeleteDialog] = useDialog();
	const handleForceDelete = () => {
		openDeleteDialog({
			title: 'Force Delete Service',
			content: 'There are pending bookings for this service, are you sure to delete?',
			dialog: [openForceDeleteDialog, closeForceDeleteDialog],
			dialogProps: {
				buttonStyle: {
					primary: true,
					variant: 'contained',
				},
			},
		}).then((result) => {
			if (result) {
				forceDeleteService({
					variables: {
						id: row.id,
					},
				}).then((result) => {
					refetchReaderServices();
				});
			}
		});
	};

	const [openEditDialog, closeEditDialog] = useDialog();

	const handleEdit = () => {
		const callBackDialog = () => {
			closeEditDialog();
		};

		openEditDialog({
			fullWidth: true,
			children: (
				<ContentDialog
					title="Service"
					form={ServiceForm}
					callbackFnc={callBackDialog}
					assetForm={{
						data: row,
						refetchReaderServices,
						closeDialog: closeEditDialog,
					}}
					showActions={false}
				/>
			),
		});
	};

	const renderAvatar = (
		<Box sx={{
			position: 'relative',
			mr: 2,
			width: 70,
			height: 100,
			boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
			border: '1px solid #e0e0e0',
		}}

			component={'img'}
			alt="book cover"
			src={_.get(row, 'book.thumbnailUrl') || ''}

		></Box>
	);

	useEffect(() => {
		setLoading(deleteLoading || forceDeleteLoading);

		return () => {
			setLoading(false);
		};
	}
		, [deleteLoading]);

	const getPriceRange = (minPrice, maxPrice) => {

		if (minPrice === maxPrice) {
			return minPrice + ' pals';
		}

		return `${minPrice} pals - ${maxPrice} pals`;
	};

	const getTotalRating = (ratings) => {
		if (ratings.length === 0) {
			return 0;
		}

		return _.sum(ratings) / ratings.length;
	};

	const getTotalReview = (reviews) => {
		return _.sum(reviews);
	};

	return (
		<>
			<TableRow>
				<TableCell sx={{ display: 'flex', alignItems: 'center', width: 300 }}>
					{renderAvatar}
					<ListItemText
						primary={_.get(row, 'book.title', 'Unknown')}
						secondary={_.get(row, 'book.authors', ['Unknown']).map(author => author.name).join(', ')}
						secondaryTypographyProps={{
							component: 'span',
							style: {
								fontSize: 'caption',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								width: '100%',
							},
						}}
					/>
				</TableCell>

				<TableCell>
					<ListItemText
						primary={`${_.get(row, 'servicesCount')} (available)`}
						primaryTypographyProps={{ typography: 'body2' }}
						secondaryTypographyProps={{
							mt: 0.5,
							component: 'span',
							typography: 'caption',
						}}
					/>
				</TableCell>

				<TableCell>
					<Label color={'success'}>
						{getPriceRange(row?.serviceMinPrice, row?.serviceMaxPrice)}
					</Label>
				</TableCell>
				<TableCell>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Iconify icon="bx:bx-time" />
						60 minutes
					</Box>
				</TableCell>
				<TableCell>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Rating value={_.get(row, "ratingAverage", 0)} readOnly precision={0.5} />(
						{_.get(row, 'totalReview', 0)})
					</Box>
				</TableCell>

				<TableCell>
					<Label
						variant={lightMode ? 'soft' : 'filled'}
						color={_.get(row, 'status', 'INACTIVE') === 'ACTIVE' ? 'success' : 'error'}
					>
						{_.get(row, 'status', 'INACTIVE')}
					</Label>
				</TableCell>

				<TableCell align="right">
					<IconButton
						// color={popover.open ? 'inherit' : 'default'}
						// onClick={popover.onOpen}
						color='default'
						onClick={() => navigate(paths.main.readerBookServices(row.book.id))}
					>
						<Iconify icon="mdi:eye" />
					</IconButton>
				</TableCell>


				{/* <CustomPopover
					open={popover.open}
					onClose={popover.onClose}
					arrow="right-top"
					sx={{ width: 160 }}
				>
					<MenuItem
						// onClick={handleEdit}
						onClick={() => navigate(paths.main.readerBookServices(row.book.id))}
						sx={{
							color: 'info.main',
						}}
					>
						<Iconify icon="bx:edit" />
						View
					</MenuItem>

					<MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
						<Iconify icon="solar:trash-bin-trash-bold" />
						Delete
					</MenuItem>
				</CustomPopover> */}
			</TableRow>
		</>
	);
}

ServicesRow.propTypes = {
	row: PropTypes.object,
};
