import { useMutation } from "@apollo/client";
import { Box, Button, LinearProgress } from "@mui/material";
import { deleteServiceMutation, forceDeleteServiceMutation, forceUpdateServiceMutation, updateServiceMutation } from "../../../../services/apolo/mutations";
import { handleFriendlyError, showNotification } from "../../../../components/common_services/CommonServices";
import { useDialog } from "../../../../components/animate/dialog/DialogProvider";
import openDeleteDialog from "../../../../components/animate/dialog/DeleteDialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { paths } from "../../../../components/router/paths";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../auth/firebase";
import { LoadingButton } from "@mui/lab";

function ReaderServiceModify({
    shortDescription,
    description,
    image,
    serviceTypeId,
    price,
    serviceId,
    setLoading,
    bookId
}) {

    const navigate = useNavigate();

    const [deleteService, { loading: deleteLoading }] = useMutation(
        deleteServiceMutation,
        {
            onCompleted: () => {
                showNotification('success', 'Service deleted successfully');
            },
            onError: () => {
                handleForceDelete();
            },
        },
    );

    const [openDialog, closeDialog] = useDialog();
    const handleDelete = () => {
        openDeleteDialog({
            title: 'Delete Service',
            content: 'Are you sure you want to delete this service?',
            dialog: [openDialog, closeDialog],
            dialogProps: {
                buttonStyle: {
                    primary: true,
                    variant: 'contained',
                },
            },
        }).then((result) => {
            if (result) {
                deleteService({
                    variables: {
                        id: serviceId,
                    },
                }).then((result) => {
                    // refetch();
                    navigate(paths.main.readerBookServices(bookId), { replace: true })
                    // history.replace(paths.main.readerBookServices(bookId));
                });
            }
        });
    };

    const [forceDeleteService, { loading: forceDeleteLoading }] = useMutation(
        forceDeleteServiceMutation,
        {
            onCompleted: () => {
                showNotification('success', 'Service deleted successfully');
            },
            onError: (e) => {
                handleFriendlyError(e, 'Failed to delete service');
            },
        },
    );

    const [openForceDeleteDialog, closeForceDeleteDialog] = useDialog();
    const handleForceDelete = () => {
        openDeleteDialog({
            title: 'Force Delete Service',
            content: 'There are pending bookings for this service, you have to finish all after service deleted. Do you want to delete?',
            dialog: [openForceDeleteDialog, closeForceDeleteDialog],
            dialogProps: {
                buttonStyle: {
                    primary: true,
                    variant: 'contained',
                },
            },
        }).then((result) => {
            if (result) {
                forceDeleteService({
                    variables: {
                        id: serviceId,
                    },
                }).then((result) => {
                    navigate(paths.main.readerBookServices(bookId), { replace: true })
                });
            }
        });
    };

    //================================================================================================

    const [updateService, { loading: updateLoading }] = useMutation(updateServiceMutation, {
        onCompleted: () => {
            showNotification('success', 'Service updated successfully');;
        },
        onError: () => {
            handleForceUpdate();
        },
    });

    const [openUpdateDialog, closeUpdateDialog] = useDialog();
    const handleUpdate = () => {
        openDeleteDialog({
            title: 'Update Service',
            content: 'Are you sure you want to update this service?',
            dialog: [openUpdateDialog, closeUpdateDialog],
            dialogProps: {
                buttonStyle: {
                    primary: true,
                    variant: 'contained',
                },
            },
        }).then(async (result) => {
            try {
                if (result) {
                    const imageUrl = await Promise.resolve(handleUploadFileToFirebaseAndSetToForm(image));
                    if (!imageUrl) {
                        showNotification('error', 'An error occurred during file upload 2.');
                        return;
                    }

                    await updateService({
                        variables: {
                            id: serviceId,
                            shortDescription: shortDescription,
                            description: description,
                            price: price,
                            imageUrl: imageUrl,
                            serviceTypeId: serviceTypeId,
                        },
                    }).then((result) => {
                        navigate(paths.main.readerServiceDetail(result.data.updateService.id), { replace: true });
                        // history.replace(paths.main.readerServiceDetail(result.data.updateService.id));
                    });
                }
            } catch (e) {
                showNotification('error', e);
            }
        });
    };

    const [forceUpdate, { loading: forceUpdateLoading }] = useMutation(
        forceUpdateServiceMutation,
        {
            onCompleted: () => {
                showNotification('success', 'Service updated successfully');
            },
            onError: (e) => {
                handleFriendlyError(e, 'Failed to update service');
            },
        },
    );

    const [openForceUpdateDialog, closeForceUpdateDialog] = useDialog();
    const handleForceUpdate = () => {
        openDeleteDialog({
            title: 'Force Update Service',
            content: 'There are pending bookings for this service, you have to finish all after service updated. Do you want to update?',
            dialog: [openForceUpdateDialog, closeForceUpdateDialog],
            dialogProps: {
                buttonStyle: {
                    primary: true,
                    variant: 'contained',
                },
            },
        }).then(async (result) => {
            if (result) {
                const imageUrl = await Promise.resolve(handleUploadFileToFirebaseAndSetToForm(image));
                if (!imageUrl) {
                    showNotification('error', 'An error occurred during file upload 2.');
                    return;
                }
                await forceUpdate({
                    variables: {
                        id: serviceId,
                        shortDescription: shortDescription,
                        description: description,
                        price: price,
                        imageUrl: imageUrl,
                        serviceTypeId: serviceTypeId,
                    },
                }).then((result) => {
                    navigate(paths.main.readerServiceDetail(result.data.keepBookingAndUpdateService.id), { replace: true });
                    // 374e79f0-5fe8-4fff-b285-8922be0390ba
                });
            }
        });
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

    useEffect(() => {
        setLoading(deleteLoading || forceDeleteLoading);

        return () => {
            setLoading(false);
        };
    }
        , [deleteLoading]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
        }}>
            {
                (!updateLoading && !forceUpdateLoading) &&
                <Button variant="outlined" color="error" sx={{ px: 2, py: 1, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} onClick={handleDelete}>Delete</Button>
            }
            <LoadingButton loading={updateLoading || forceUpdateLoading} variant="contained" sx={{ px: 2, py: 1, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} onClick={handleUpdate}>Save Changes</LoadingButton>
        </Box>
    );
}
export default ReaderServiceModify;