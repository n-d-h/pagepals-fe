/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import { useMutation } from '@apollo/client';
import { useBoolean } from '../../../../components/hooks/use-boolean';
import { updateAccountState, updateSetting } from '../../../../services/apolo/mutations';

import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';
import Iconify from '../../../../components/iconify/iconify';
import Label from '../../../../components/label/label';

import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import UserQuickEditForm from '../form_edit/UserQuickEditForm';

// ----------------------------------------------------------------------

export default function UserTableRow({ index, row, selected, onEditRow, onSelectRow, onDeleteRow, listStatus, filters }) {
  // const { name, avatarUrl, company, role, status, email, phoneNumber } = row;

  const { id, key, value } = row;

  const confirm = useBoolean();

  const [openDialog, closeDialog] = useDialog();

  const quickEdit = useBoolean();

  const popover = usePopover();

  // const [currency, setCurrency] = React.useState('');

  const [update, { loading, error }] = useMutation(updateSetting, {
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while updating setting');
    },

    onCompleted: () => {
      showNotification('success', 'Update successfully');
    },
  });

  const getCurrency = () => {
    switch (key) {
      case 'REVENUE_SHARE':
        return '%';
      case 'TOKEN_PRICE':
        return '$ / pals';
      case 'DOLLAR_EXCHANGE_RATE':
        return 'VND / $';
      case 'ADVERTISE_PRICE':
        return '$ / ads';
      default:
        return '';
    }
  }

  const currency = getCurrency();


  const handleEdit = async () => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (variables) => {
      try {
        const res = await update({
          variables: {
            setting: variables,
          },
        });

        if (res) {
          onEditRow(res.data.updateSetting);
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
            currency,
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{key}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{value}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currency}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>

          <IconButton color={'default'} onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

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
