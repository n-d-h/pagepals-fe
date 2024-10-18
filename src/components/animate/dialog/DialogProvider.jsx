/* eslint-disable react/prop-types */
import { Grow } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { useState, createContext, useRef, useContext, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Transition = forwardRef(function Transition (props, ref) {
  return <Grow ref={ref} {...props} timeout={400} />;
});
const DialogContext = createContext();
function DialogContainer (props) {
  const { children, open, onClose, zIndex, paperProps } = props;

  return (
		<Dialog
			PaperProps={{
			  sx: {
			    borderRadius: '1rem',
			    ...paperProps,
			  },
			}}
			sx={{
			  zIndex: zIndex || 1300,
			}}
			open={open}
			onClose={onClose}
			TransitionComponent={Transition}
			{...props}
		>
			{children}
		</Dialog>
  );
}

export default function DialogProvider (props) {
  const [dialogs, setDialogs] = useState([]);

  const createDialog = (option) => {
    const dialog = { ...option, open: true };
    setDialogs((dialogs) => [...dialogs, dialog]);
  };

  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...dialogs];
    });
  };

  const closeDialogByName = (name) => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.find((dialog) => dialog.name === name);
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return dialogs.filter((dialog) => dialog.name !== name);
    });
  };

  const closeAllDialog = () => {
    setDialogs([]);
  };

  const contextValue = useRef([
    createDialog,
    closeDialog,
    closeAllDialog,
    closeDialogByName,
  ]);

  return (
		<DialogContext.Provider value={contextValue.current}>
			{props.children}
			{dialogs.map((dialog, i) => {
			  return <DialogContainer key={i} {...dialog} />;
			})}
		</DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext);

DialogContainer.propsType = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onKill: PropTypes.func.isRequired,
};

DialogContainer.defaultProps = {
  children: null,
  open: false,
  onClose: () => {},
  onKill: () => {},
  zIndex: 1300,
  paperProps: {},
};
