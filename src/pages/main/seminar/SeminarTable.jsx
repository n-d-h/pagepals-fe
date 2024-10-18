/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label/label';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom, TablePaginationCustom } from '../../../components/table';
import { Divider, IconButton, MenuItem, Select, TableHead, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import openDeleteDialog from '../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { usePopover } from '../../../components/custom-popover';
import CustomPopover from '../../../components/custom-popover/custom-popover';
import { paths } from '../../../components/router/paths';
import SeminarForm from './SeminarForm';
import { createEventMutation, deleteSeminarMutation } from '../../../services/apolo/mutations';
import { useCallback, useState } from 'react';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import { useMutation } from '@apollo/client';
import { showNotification } from '../../../components/common_services/CommonServices';
import { selectUser } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import CreateEventForm from './CreateEventForm';
import { ref } from 'firebase/storage';

// ----------------------------------------------------------------------

const StateLabelENUM = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

const StateColorENUM = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'error',
};

const SeminarTable = ({
  title,
  subheader,
  tableLabels,
  tableData,
  refetch,
  eventRefetch,
  paginationDataCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  requestState,
  handleRequestState,
  handleChangeSearch,
  searchValue,
  setSearchValue,
  readerSeminarLoading,
  ...other
}) => {
  //   const [handleAddSeminar, { data, loading, error }] = useMutation();

  const [openDialog, closeDialog] = useDialog();
  const navigate = useNavigate();


  const handleOpenDialogSeminar = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (data) => {
      try {
        refetch();
        // Callbacks after successful Seminar
        closeDialog();
      } catch (error) { }
      closeDialog();
    };

    openDialog({
      maxWidth: 'md',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Seminar"
          form={SeminarForm}
          assetForm={{
            update: updateConfig,
            closeDialog,
            refetch,
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  const [search, setSearch] = useState(searchValue);
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
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }}
        action={
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => { navigate(paths.main.createSeminar); }}
            startIcon={<Iconify icon="bx:bx-plus" />}
          >
            Add Seminar
          </Button>
        } />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2, pl: 2 }}>
        <Select value={requestState} onChange={(e) => {
          handleRequestState(e.target.value);
        }} sx={{ ml: 4 }} size='small'>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="ACCEPTED">Accepted</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </Select>
      </Box>

      <TableContainer sx={{ overflowY: 'scroll', px: 4, maxHeight: '55vh' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search seminar"
                    value={search}
                    onChange={handleChangeValueSearch}
                    InputProps={{
                      endAdornment: readerSeminarLoading
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

              {
                tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No seminar found
                    </TableCell>
                  </TableRow>
                )
              }
              {tableData.length > 0 && tableData.map((row) => (
                <SeminarTransitionRow key={row.id} row={row} refetch={refetch} eventRefetch={eventRefetch} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 0, textAlign: 'right' }}>
        <TablePaginationCustom
          count={
            paginationDataCount
          }
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Box>

    </Card>
  );
};

SeminarTable.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

function SeminarTransitionRow({ row, refetch, eventRefetch }) {
  const renderAvatar = (
    <Box sx={{ position: 'relative', mr: 2 }}>


      <Box sx={{
        position: 'relative',
        mr: 2,
        width: 110,
        height: 110,
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
      }}

        component={'img'}
        alt="book cover"
        src={_.get(row, 'imageUrl')}

      ></Box>
    </Box>
  );

  const popover = usePopover();

  const [deleteSeminar, { loading }] = useMutation(
    deleteSeminarMutation,
    {
      onError: (e) => {
        handleFriendlyError(e, 'Failed to delete seminar');
      },

      onCompleted: () => {
        showNotification('success', 'Seminar deleted successfully');
        refetch();
      },

    },
  );

  const [openDelDialog, closeDelDialog] = useDialog();
  const handleDelete = () => {
    openDeleteDialog({
      title: 'Delete seminar',
      content: 'Are you sure you want to delete this seminar?',
      dialog: [openDelDialog, closeDelDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        deleteSeminar({
          variables: {
            id: row.id,
          },
        }).then((result) => {
          refetch();
        });
      }
    });
  };

  const [createEventMutate, { loading: createEventLoading }] = useMutation(createEventMutation, {
    onCompleted: (data) => {
      eventRefetch();
      refetch();
      showNotification('success', 'Event created successfully');
    },
    onError: (e) => {
      showNotification('error', 'Exceed the maximum number of events allowed for this seminar');
    },
  });

  const userProfile = useSelector(selectUser);
  const [openDialog, closeDialog] = useDialog();
  const createEvent = (id) => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (eventData) => {
      await createEventMutate({
        variables: {
          input: {
            seminarId: id,
            ...eventData,
            startAt: moment(eventData.startAt).format('YYYY-MM-DD HH:mm:ss'),
          },
          readerId: _.get(userProfile, 'reader.id'),
        },
      });

      closeDialog();
    };

    openDialog({
      maxWidth: 'sm',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Create Event"
          form={CreateEventForm}
          assetForm={{
            refetch,
            callBackDialog,
            loading: createEventLoading,
            update: updateConfig,
            isCreating: true,
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  const startAtMoment = moment(row?.startTime).format('LLLL'); // Converts the startAt to a moment object
  const endAt = moment(startAtMoment).add(row?.duration, 'minutes').format('LLLL'); // This calculates the end time by adding the duration to startAt
  const now = moment(); // Gets the current time

  const navigate = useNavigate();

  const viewSeminar = (id) => {
    navigate(paths.main.viewSeminar(id));
  };

  const editSeminar = (id) => {
    navigate(paths.main.editSeminar(id));
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAvatar}
          <ListItemText primary={_.get(
            row,
            'title',
          )} />
        </TableCell>

        <TableCell>
          <Typography variant="body1" color={'Graytext'} textAlign={'start'} fontWeight={600} fontSize={15}>60 minutes</Typography>
        </TableCell>

        <TableCell>
          <Label color={'info'}>
            {row?.events?.length} events
          </Label>
        </TableCell>

        <TableCell>
          <Label color={StateColorENUM[row.state]}>
            {StateLabelENUM[row.state]}
          </Label>
        </TableCell>

        <TableCell>
          <Label color={'warning'}>
            {moment(row.createdAt).format('LLLL')}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
      >

        {row.state === 'PENDING'
          ? (<MenuItem

            sx={{ color: 'info.main' }}
            onClick={() => {
              editSeminar(row.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>)
          : (
            <MenuItem
              sx={{ color: 'info.main' }}
              onClick={() => {
                viewSeminar(row.id);
                popover.onClose();
              }}
            >
              <Iconify icon="bx:bxs-show" />
              View
            </MenuItem>
          )}

        {row.state === 'ACCEPTED' && (
          <MenuItem
            // sx={{ color: 'info.main' }}
            onClick={() => {
              createEvent(row.id);
              popover.onClose();
            }}
          >
            <Iconify icon="lets-icons:add-round-fill" />
            Create Event
          </MenuItem>
        )}
        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

export default SeminarTable;

SeminarTransitionRow.propTypes = {
  row: PropTypes.object,
};
