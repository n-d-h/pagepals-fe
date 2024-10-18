/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from '../../../../components/hooks/use-boolean';
import { useMutation } from '@apollo/client';
import { updateAccount } from '../../../../services/apolo/mutations';

import Label from '../../../../components/label/label';
import Iconify from '../../../../components/iconify/iconify';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';

import UserQuickEditForm from '../form_edit/UserQuickEditForm';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';

// ----------------------------------------------------------------------

export default function UserTableRow ({ row, selected, onEditRow, onSelectRow, onDeleteRow, listStatus }) {
  // const { name, avatarUrl, company, role, status, email, phoneNumber } = row;

  const avatarUrl = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${Math.floor(Math.random() * 20) + 1}.jpg`;

  const { accountState, createdAt, email, fullName, phoneNumber, updatedAt, username } = row;

  const confirm = useBoolean();

  const [openDialog, closeDialog] = useDialog();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const handleDelete = async () => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = () => {
      // call api booking
      onDeleteRow(row.id);
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Delete"
          content={
            <div style={{
              marginBottom: 30,
            }}>
              Are you sure want to delete?
              <Button
                variant="contained"
                onClick={updateConfig}
                color="primary"
                size="small"
                style={{ marginLeft: 40 }}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={callBackDialog}
                color="secondary"
                size="small"
                style={{ marginLeft: 10 }}
              >
                No
              </Button>
            </div>
          }
          showActions={false}
          callbackFnc={callBackDialog}
        />
      ),
    });
  };

  const [update, { loading, error }] = useMutation(updateAccount, {
    onError: (e) => {
      handleFriendlyError(e, 'Update failed');
    },

    onCompleted: (data) => {
      showNotification('success', 'Update success');
    },

  });

  const handleEdit = async () => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (accountData) => {
      try {
        const res = await update({
          variables: {
            id: row.id,
            account: {
              email: accountData.email,
              fullName: accountData.name,
              phoneNumber: accountData.phoneNumber,
              username: accountData.username,
              accountState: accountData.status,
            },
          },
        });

        if (res) {
          onEditRow(res.data.updateAccount);
          closeDialog();
        }
      } catch (e) {
      }
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Edit"
          form={UserQuickEditForm}
          assetForm={{
            currentUser: row,
            listStatus,
            onClose: callBackDialog,
            onUpdate: updateConfig,
            updateLoading: loading,
          }}
          showActions={false}
          callbackFnc={callBackDialog}
        />
      ),
    });
  };

  // if (loading) return <BackdropLoading />;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullName} src={avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={fullName}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{username}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>Staff</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (accountState.name.toLowerCase() === 'active' && 'success') ||
              (accountState.name.toLowerCase() === 'pending' && 'warning') ||
              (accountState.name.toLowerCase() === 'banned' && 'error') ||
              (accountState.name.toLowerCase() === 'deleted' && 'error') ||
              'default'
            }
          >
            {accountState.name ? accountState.name : 'NotDefined'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={'default'} onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} listStatus={listStatus} /> */}

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >

        <MenuItem
          onClick={() => {
            handleEdit();
            // onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

      </CustomPopover> */}
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
