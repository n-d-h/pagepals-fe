import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { fCurrency } from '../../../../utils/format-number';

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import { emptyRows, TableEmptyRows, TableHeadCustom } from '../../../../components/table';
import Rating from '@mui/material/Rating';
import CustomImage from '../../../../components/image/CustomImage';
import { Box } from '@mui/material';
import image from '../../../../assets/landing/no-data.webp';

// ----------------------------------------------------------------------

export default function EcommerceBestSalesman ({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom headLabel={tableLabels} />

            {tableData
              ? <TableBody>
                {tableData.map((row, index) => (
                  <EcommerceBestSalesmanRow key={row.id} row={row} rank={'Top ' + (index + 1)} />
                ))}
              </TableBody>
              : <TableEmptyRows
                height={52}
                emptyRows={emptyRows(1, 5, 5)}
              />
            }
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

EcommerceBestSalesman.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function EcommerceBestSalesmanRow ({ row, rank }) {
  return (
    <TableRow>

      <TableCell align="right">
        <Label
          variant="soft"
          color={
            (rank === 'Top 1' && 'primary') ||
            (rank === 'Top 2' && 'info') ||
            (rank === 'Top 3' && 'success') ||
            (rank === 'Top 4' && 'warning') ||
            'error'
          }
        >
          {rank}
        </Label>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.reader.nickname} src={row.reader.avatarUrl} sx={{ mr: 2 }} />
        {row.reader.nickname}
      </TableCell>

      <TableCell>{row.reader.account.email}</TableCell>

      <TableCell align="center">{fCurrency(row.totalIncome)}</TableCell>

      <TableCell align="right">
        <Rating readOnly size="small" precision={0.5} name="reviews" value={row.reader.rating} />
      </TableCell>

    </TableRow>
  );
}

EcommerceBestSalesmanRow.propTypes = {
  row: PropTypes.object,
};
