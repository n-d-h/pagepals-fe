/* eslint-disable no-unused-vars */
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
import { getListStaff, getListStaffAndListAccountState } from '../../../services/apolo/queries';
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
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone Number', width: 180 },
  { id: 'username', label: 'Username', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function UserListView () {
  const table = useTable();

  const confirm = useBoolean();

  const [openDialog, closeDialog] = useDialog();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [listStatus, setListStatus] = useState([{ value: 'all', label: 'ALL' }]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

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

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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

  const handNewStaff = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
				<ContentDialog
					title="Delete"
					form={UserQuickNewForm}
					assetForm={{
					  open: true,
					  onCancel: callBackDialog,
					  tableData,
					  setTableData,
					  onClose: callBackDialog,
					}}
					callbackFnc={callBackDialog}
				/>
      ),
    });
  };

  const setDataFetching = (data) => {
    setTableData(data.getListStaff);
    if (data.getListAccountState) {
      const list = data.getListAccountState.map((item) => {
        return { value: item.name.toLowerCase(), label: item.name };
      });
      setListStatus([...listStatus, ...list]);
    }
  };

  const { loading, error, data } = useQuery(getListStaffAndListAccountState, {
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
					  { name: 'Management' },
					  { name: 'Staff' },
					]}
					action={
						<Button
							onClick={handNewStaff}
							variant="contained"
							startIcon={<Iconify icon="mingcute:add-line" />}
						>
							New Staff
						</Button>
					}
					sx={{
					  mb: { xs: 3, md: 5 },
					}}
				/>

				<Card>
					<Tabs
						value={filters.status}
						onChange={handleFilterStatus}
						sx={{
						  px: 2.5,
						  boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
						}}
					>
						{listStatus.map((tab) => {
						  if (tab.value === 'reader_pending' || tab.value === 'reader_active' || tab.value === 'banned') return null;
						  return (
								<Tab
									key={tab.value}
									iconPosition="end"
									value={tab.value}
									label={tab.label}
									icon={
										<Label
											variant={
												((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
											}
											color={
												(tab.value === 'active' && 'success') ||
												(tab.value === 'pending' && 'warning') ||
												(tab.value === 'banned' && 'error') ||
												(tab.value === 'deleted' && 'error') ||
												'default'
											}
										>
											{tab.value === 'all' && tableData?.length}
											{tab.value === 'active' &&
												tableData?.filter((user) => user.accountState.name.toLowerCase() === 'active').length}

											{tab.value === 'pending' &&
												tableData?.filter((user) => user.accountState.name.toLowerCase() === 'pending').length}
											{tab.value === 'banned' &&
												tableData?.filter((user) => user.accountState.name.toLowerCase() === 'banned').length}
											{tab.value === 'inactive' &&
												tableData?.filter((user) => user.accountState.name.toLowerCase() === 'inactive').length}
											{tab.value === 'deleted' &&
												tableData?.filter((user) => user.accountState.name.toLowerCase() === 'deleted').length}
										</Label>
									}
								/>
						  );
						})}
					</Tabs>

					<UserTableToolbar
						filters={filters}
						onFilters={handleFilters}
					/>

					{canReset && (
						<UserTableFiltersResult
							filters={filters}
							onFilters={handleFilters}
							//
							onResetFilters={handleResetFilters}
							//
							results={dataFiltered.length}
							sx={{ p: 2.5, pt: 0 }}
						/>
					)}

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
							<Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={table.order}
									orderBy={table.orderBy}
									headLabel={TABLE_HEAD}
									rowCount={tableData?.length}
									numSelected={table.selected.length}
									onSort={table.onSort}
									onSelectAllRows={(checked) =>
									  table.onSelectAllRows(
									    checked,
									    tableData?.map((row) => row.id),
									  )
									}
								/>

								<TableBody>
									{dataFiltered
									  .slice(
									    table.page * table.rowsPerPage,
									    table.page * table.rowsPerPage + table.rowsPerPage,
									  )
									  .map((row) => (
											<UserTableRow
												key={row.id}
												row={row}
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

					<TablePaginationCustom
						count={dataFiltered.length}
						page={table.page}
						rowsPerPage={table.rowsPerPage}
						onPageChange={table.onChangePage}
						onRowsPerPageChange={table.onChangeRowsPerPage}
						//
						dense={table.dense}
						onChangeDense={table.onChangeDense}
					/>
				</Card>
			</Container>
		</>
  );
}
