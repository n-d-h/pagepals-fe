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
import { updateAccount, updateAccountState } from '../../../../services/apolo/mutations';

import Label from '../../../../components/label/label';
import Iconify from '../../../../components/iconify/iconify';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';

import UserQuickEditForm from '../form_edit/UserQuickEditForm';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';

// ----------------------------------------------------------------------

export default function UserTableRow ({ row, selected, onEditRow, onSelectRow, onDeleteRow, listStatus }) {
  // const { name, avatarUrl, company, role, status, email, phoneNumber } = row;

  const avatarUrl = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${Math.floor(Math.random() * 20) + 1}.jpg`;

  const { accountState, createdAt, email, fullName, phoneNumber, updatedAt, username, reader } = row;

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

  const [update, { loading }] = useMutation(updateAccountState, {
    onError: (e) => {
      handleFriendlyError(e, 'Update fail');
    },

    onCompleted: (data) => {
      showNotification('success', 'Update successfully');
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
            accountState: accountData.status.toUpperCase(),
          },
        });

        if (res) {
          onEditRow(res.data.updateAccountState);
          closeDialog();
        }
      } catch (e) {
        console.error('error', e);
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
          }}
          showActions={false}
          callbackFnc={callBackDialog}
        />
      ),
    });
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullName} src={avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={reader && reader.nickname ? reader.nickname : ''}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber || 'null'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{username}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>Reader</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (accountState.name.toLowerCase() === 'active' && 'success') ||
              (accountState.name.toLowerCase() === 'pending' && 'warning') ||
              (accountState.name.toLowerCase() === 'banned' && 'error') ||
              (accountState.name.toLowerCase() === 'deleted' && 'error') ||
              (accountState.name.toLowerCase() === 'reader_active' && 'success') ||
              (accountState.name.toLowerCase() === 'reader_pending' && 'warning') ||
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
