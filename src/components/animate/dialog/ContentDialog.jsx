import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Iconify from '../../iconify/iconify';

export default function ContentDialog (props) {
  const handleArgee = () => {
    props.callbackFnc(true);
  };

  const handleCancel = () => {
    props.callbackFnc(false);
  };

  return (
		<>
			<DialogTitle
				component={'div'}
				sx={{
				  padding: '15px 12px',
				  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
				  textAlign: 'center',

				  fontSize: '1.5rem',
				  marginBottom: '1rem',
				}}
			>
				{props.title}
				{!props.hideExitButton && (
					<IconButton
						aria-label="close"
						color="error"
						onClick={() => {
						  handleCancel();
						}}
						sx={{
						  position: 'absolute',
						  right: 8,
						  top: 8,
						}}
					>
						<Iconify icon="mdi:close" />
					</IconButton>
				)}
			</DialogTitle>

			<DialogContent
				sx={{
				  paddingTop: '20px !important',
				  ...props.contentStyles,
				}}
			>
				{props.content && (
					<DialogContentText>{props.content}</DialogContentText>
				)}
				{props.form && (
					<Box sx={{ m: 2, display: 'contents' }}>
						{props.form({
						  ...props.assetForm,
						  callbackFnc: props.callbackFnc,
						})}
					</Box>
				)}
				{props.fullViewContent && (
					<Box sx={{ m: 2, width: '100%', height: '100%' }}>
						{props.fullViewContent}
					</Box>
				)}
			</DialogContent>
			{props.showActions
			  ? (
				<DialogActions>
					<Button
						variant="contained"
						onClick={handleArgee}
						color="primary"
						size="small"
					>
						{props.agreeButtonName || 'Yes'}
					</Button>
					<Button
						variant="outlined"
						onClick={handleCancel}
						color="primary"
						size="small"
						{...props.cancelButtonStyle}
					>
						{props.cancelButtonName || 'No'}
					</Button>
				</DialogActions>
			    )
			  : (
			  ''
			    )}
		</>
  );
}

ContentDialog.defaultProps = {
  showActions: true,
};

ContentDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  fullViewContent: PropTypes.element,
  form: PropTypes.func,
  formikObj: PropTypes.object,
  assetForm: PropTypes.object,
  callbackFnc: PropTypes.func,
  showActions: PropTypes.bool,
  agreeButtonName: PropTypes.string,
  cancelButtonName: PropTypes.string,
  cancelButtonStyle: PropTypes.object,
};
