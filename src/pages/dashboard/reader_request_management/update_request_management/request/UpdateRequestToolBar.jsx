import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import RouterLink from '../../../../../components/router/router-link';

import Iconify from '../../../../../components/iconify';
import { TextField } from '@mui/material';
import { paths } from '../../../../../components/router/paths';

// ----------------------------------------------------------------------

export default function UpdateRequestToolBar({
    description,
    setDescription,
    onReject,
    onAcceptRequest,
    sx,
    ...other
}) {

    const renderButtonInterviewPending = (
        <>
            <TextField
                label="Decription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button
                color="error"
                variant="contained"
                onClick={onReject}
                sx={{ textTransform: 'capitalize' }}
            >
                Reject
            </Button>
            <Button
                color="success"
                variant="contained"
                onClick={onAcceptRequest}
                sx={{ textTransform: 'capitalize' }}
            >
                Pass
            </Button>
        </>
    );

    return (
        <>
            <Stack
                spacing={1.5}
                direction="row"
                sx={{
                    mb: { xs: 3, md: 5 },
                    mt: { xs: 3, md: 5 },
                    ...sx,
                }}
                {...other}
            >
                <Button
                    component={RouterLink}
                    href={paths.dashboard.updateRequestManagement}
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
                >
                    Back
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                {renderButtonInterviewPending}
            </Stack>

        </>
    );
}

UpdateRequestToolBar.propTypes = {
    sx: PropTypes.object,
};
