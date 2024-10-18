// / Implementing

import ContentDialog from './ContentDialog';

export default function openDeleteDialog (props) {
  return new Promise((resolve, reject) => {
    const { dialog, title, content } = props;
    const [openDialog, closeDialog] = dialog;
    const callback = (result) => {
      resolve(result);
      closeDialog();
    };

    openDialog({
      ...props.dialogProps,
      children: (
        <ContentDialog
          title={title || 'Confirmation'}
          content={content || 'Are you sure to delete?'}
          callbackFnc={callback}
          showActions={props.showActions ?? true}
          {...props.dialogProps?.contentDialog}
          {...props.dialogProps?.buttonStyle}
        />
      ),
    });
  });
}
