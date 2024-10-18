import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useQuery, useMutation } from '@apollo/client';
import { getAllSettings, getListCustomerAndListAccountState } from '../../../services/apolo/queries';
import { updateAccountState } from '../../../services/apolo/mutations';

import { useBoolean } from '../../../components/hooks/use-boolean';
import { applyFilter } from './table_filter/applyFilter';

import Label from '../../../components/label/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import {
	useTable,
	emptyRows,
	TableNoData,
	getComparator,
	TableEmptyRows,
	TableHeadCustom,
	TableSelectedAction,
	TablePaginationCustom,
} from '../../../components/table';

import UserTableRow from './user_table/UserTableRow';
import UserTableToolbar from './user_table/UserTableToolbar';
import UserTableFiltersResult from './user_table/UserTableFiltersResult';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import UserQuickNewForm from './form_new/UserQuickNewForm';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const TABLE_HEAD = [
	{ id: 'no', label: 'No', width: 30 },
	{ id: 'key', label: 'Key', width: 300 },
	{ id: 'value', label: 'Value', width: 50 },
];

const defaultFilters = {
	name: '',
	role: [],
	status: 'all',
};

// ----------------------------------------------------------------------

export default function UserListView() {
	const table = useTable();


	const [openDialog, closeDialog] = useDialog();

	const [tableData, setTableData] = useState([]);

	const [filters, setFilters] = useState(defaultFilters);

	const [listStatus, setListStatus] = useState([{ value: 'all', label: 'ALL' }]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(table.order, table.orderBy),
		filters,
	});


	const denseHeight = table.dense ? 52 : 72;

	const canReset = !isEqual(defaultFilters, filters);

	const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;


	const [updateState, { loading: stateLoading }] = useMutation(updateAccountState);

	const handleEditRow = async (data) => {
		const updatedUserIndex = tableData.findIndex((user) => user?.id === data.id);

		const updatedUsers = [...tableData];
		updatedUsers[updatedUserIndex] = data;
		setTableData(updatedUsers);
	};

	const handleDeleteRow = async (data) => {
		try {
			const response = await updateState({
				variables: {
					id: data,
					accountState: 'DELETED',
				},
			});

			if (response) {
				const updatedStaff = response.data.updateAccountState;
				handleEditRow(updatedStaff);
				showNotification('success', 'Deleted successfully');
			}
		} catch (error) {
			handleFriendlyError(error, 'Delete failed');
		}
	};

	const handleDelete = async (data) => {
		const callBackDialog = () => {
			closeDialog();
		};

		const updateConfig = (data) => {
			// call api booking
			closeDialog();
		};

		openDialog({
			maxWidth: 'xs',
			fullWidth: true,
			children: (
				<ContentDialog
					title="Delete"
					content={
						<>
							Are you sure want to delete <strong> {table.selected.length} </strong> items?
						</>
					}
					action={
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								updateConfig();
							}}
							showActions={false}
						>
							Delete
						</Button>
					}

					callbackFnc={callBackDialog}
				/>
			),
		});
	};

	const setDataFetching = (data) => {
		setTableData(data.getAllSettings);
	};

	const { loading, error } = useQuery(getAllSettings, {
		onCompleted: setDataFetching,
	});
	if (loading) return <BackdropLoading />;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<>
			<Container maxWidth='xl'>

				<CustomBreadcrumbs
					heading="List"
					links={[
						{ name: 'Dashboard' },
						{ name: 'Setting Management' },
					]}
					sx={{
						mb: { xs: 3, md: 5 },
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Card sx={{ maxWidth: 'md', }}>

						<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
							<TableSelectedAction
								dense={table.dense}
								numSelected={table.selected.length}
								rowCount={tableData?.length}
								onSelectAllRows={(checked) =>
									table.onSelectAllRows(
										checked,
										tableData?.map((row) => row.id),
									)
								}
								action={
									<Tooltip title="Delete">
										<IconButton color="primary" onClick={handleDelete}>
											<Iconify icon="solar:trash-bin-trash-bold" />
										</IconButton>
									</Tooltip>
								}
							/>

							<Scrollbar>
								<Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 500 }}>
									<TableHeadCustom
										order={table.order}
										orderBy={table.orderBy}
										headLabel={TABLE_HEAD}
										rowCount={tableData?.length}
										numSelected={table.selected.length}
										onSort={table.onSort}
									/>

									<TableBody>
										{dataFiltered
											.slice(
												table.page * table.rowsPerPage,
												table.page * table.rowsPerPage + table.rowsPerPage,
											)
											.map((row, index) => (
												<UserTableRow
													index={index}
													key={row.id}
													row={row}
													filters={filters}
													listStatus={listStatus}
													selected={table.selected.includes(row.id)}
													onSelectRow={() => table.onSelectRow(row.id)}
													onDeleteRow={() => handleDeleteRow(row.id)}
													onEditRow={(data) => handleEditRow(data)}
												/>
											))}

										<TableEmptyRows
											height={denseHeight}
											emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)}
										/>

										<TableNoData notFound={notFound} />
									</TableBody>
								</Table>
							</Scrollbar>
						</TableContainer>

					</Card>
				</div>

			</Container>
		</>
	);
}
