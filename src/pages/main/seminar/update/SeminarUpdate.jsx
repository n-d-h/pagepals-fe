import { Box, Button } from "@mui/material";
import { showNotification } from "../../../../components/common_services/CommonServices";
import { deleteSeminarMutation, updateSeminarMutation } from "../../../../services/apolo/mutations";
import { useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../auth/firebase";
import { paths } from "../../../../components/router/paths";
import { useNavigate } from "react-router";
import { set } from "lodash";
import { useState } from "react";
import { useDialog } from "../../../../components/animate/dialog/DialogProvider";
import openDeleteDialog from "../../../../components/animate/dialog/DeleteDialog";

export default function SeminarUpdate({ seminarId, duration, description, imageFile, title, setReload, isRejected, isAccepted }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const [deleteSeminar, { loading: deleteLoading }] = useMutation(deleteSeminarMutation, {
        onCompleted: () => {
            showNotification('success', 'Seminar deleted successfully');
        },
        onError: () => {
            showNotification('error', 'An error occurred while deleting seminar');
        },
    });

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
                setReload(true);
                deleteSeminar({
                    variables: {
                        id: seminarId,
                    },
                }).then((result) => {
                    setReload(false);
                    navigate(paths.main.seminar);
                });
            }
        });
    };

    const [updateSeminar, { loading: updateLoading }] = useMutation(updateSeminarMutation, {
        onCompleted: () => {
            showNotification('success', 'Seminar updated successfully');;
        },
        onError: () => {
            showNotification('error', 'An error occurred while updating seminar');
        },
    });
    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const imageUrl = await Promise.resolve(handleUploadFileToFirebaseAndSetToForm(imageFile));
            if (!imageUrl) {
                showNotification('error', 'An error occurred during file upload 2.');
                return;
            }

            await updateSeminar({
                variables: {
                    id: seminarId,
                    duration: duration,
                    description: description,
                    imageUrl: imageUrl,
                    title: title,
                },
            }).then((result) => {
                setIsUpdating(false);
                // navigate(paths.main.editSeminar(result.data.updateSeminarRequest.id), { replace: true });
            });
        } catch (e) {
            showNotification('error', e);
        }
    };

    const handleUploadFileToFirebaseAndSetToForm = async (file) => {
        if (!file) return null;

        if (typeof file === 'string') return file;

        try {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
            return downloadURL;
        } catch (error) {
            showNotification('error', 'An error occurred during file upload 1.');
        }
    };
    if (isRejected) {
        return (
            <Button variant="contained" color="error" sx={{ px: 2, py: 1, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} onClick={handleDelete}>Delete this request</Button>
        );
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
        }}>

            {!isUpdating && <Button variant="outlined" color="error" sx={{ px: 2, py: 1, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} onClick={handleDelete}>Delete</Button>}

            {!isAccepted && <LoadingButton loading={isUpdating} color='success' variant="contained" sx={{ px: 2, py: 1, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} onClick={handleUpdate}>Save Changes</LoadingButton>}
        </Box>
    );
};