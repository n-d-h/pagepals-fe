import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import CustomImage from "../../../../components/image/CustomImage";
import image from "../../../../assets/landing/no-data.webp";
import { useState } from "react";
import Label from "../../../../components/label";
import Iconify from "../../../../components/iconify";
import { useDialog } from "../../../../components/animate/dialog/DialogProvider";
import { countries, uniqueLanguages } from "../../../profile/personal/data";
import ContentDialog from "../../../../components/animate/dialog/ContentDialog";
import InformationDetailsContent from "../../../dashboard/reader_request_management/detail/component/InformationDetailsContent";
export default function HistoryRequest({ post }) {

    const { lastRequests } = post;

    const [expanded, setExpanded] = useState({});

    const [openDialog, closeDialog] = useDialog();

    const handleViewDetail = async (request) => {
        const callBackDialog = (state) => {
            closeDialog();
        };

        openDialog({
            maxWidth: 'mb',
            fullWidth: true,
            children: (
                <ContentDialog
                    title="Detail"
                    content={
                        <InformationDetailsContent post={request} isCustomer={true} />
                    }

                    showActions={false}

                    callbackFnc={callBackDialog}
                />
            ),
        });
    };

    const handleViewAnswer = async (request) => {
        const callBackDialog = (state) => {
            closeDialog();
        };

        openDialog({
            maxWidth: 'mb',
            fullWidth: true,
            children: (
                <ContentDialog
                    title="Detail"
                    content={
                        <Stack component={Card} spacing={3} sx={{ p: 3 }}>
                            <Typography variant="h4">{'List Reader\'s Answer'}</Typography>

                            {request?.answers.map((answer, index) => (
                                <Stack key={index} spacing={2}>
                                    <Typography key={index + 1} variant="h6">{answer.question.content}</Typography>
                                    <Typography key={index + 2} variant="body1">{answer.content}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    }

                    showActions={false}

                    callbackFnc={callBackDialog}
                />
            ),
        });
    };

    const renderEmpty = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>
            <CustomImage src={image} sx={{ width: 320, height: 320 }} />
            <Typography variant="body2">Don't have any request yet</Typography>
        </Box>
    )

    const renderContent = (
        <Grid item container xs={12} rowSpacing={2} rowGap={1} mt={1}>
            {lastRequests?.map((request, index) => (
                <Grid item xs={12} key={index} sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                }}>
                    <Accordion expanded={
                        expanded[request.id]
                    }
                        onChange={() => {
                            setExpanded({
                                ...expanded,
                                [request.id]: !expanded[request.id],
                            });
                        }}>
                        <AccordionSummary
                            expandIcon={<Iconify icon="ic:baseline-expand-more" />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderBottom: expanded[request.id] ? 'none' : '1px solid #e0e0e0',
                                borderTopRightRadius: 16,
                                borderTopLeftRadius: 16,
                                borderBottomRightRadius: expanded[request.id] ? 0 : 16,
                                borderBottomLeftRadius: expanded[request.id] ? 0 : 16,
                                p: 2,
                            }}
                        >

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold" mr='3px'>Request ID </Typography>
                                <Typography variant="body2"> [{request?.id}]</Typography>
                            </Box>


                        </AccordionSummary>
                        <AccordionDetails sx={{
                            border: '1px solid #e0e0e0',
                            borderTop: 'none',
                            borderBottomRightRadius: 16,
                            borderBottomLeftRadius: 16,
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold" >Status</Typography>
                                <Label
                                    variant="soft"
                                    color={
                                        (request?.state.toLowerCase() === 'pass' && 'success') ||
                                        (request?.state.toLowerCase() === 'reject' && 'error') ||
                                        'warning'
                                    }
                                >
                                    {request.state ? request.state : 'NotDefined'}
                                </Label>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold" >Staff ID</Typography>
                                <Typography variant="body2" >{request?.staffId}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold" >Staff Name</Typography>
                                <Typography variant="body2" >{request?.staffName}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold" >Reject Reason</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{request?.rejectReason || '<Staff did not fill reason>'}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}></Typography>
                                <Button
                                    color="success"
                                    variant="contained"
                                    sx={{ textTransform: 'capitalize' }}
                                    onClick={() => handleViewDetail(request)}
                                >View Detail</Button>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}></Typography>
                                <Button
                                    color="success"
                                    variant="contained"
                                    sx={{ textTransform: 'capitalize' }}
                                    onClick={() => handleViewAnswer(request)}
                                >View Answer</Button>
                            </Box>

                        </AccordionDetails>
                    </Accordion>

                </Grid>
            ))}
        </Grid>
    )

    return (
        <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', mr: 2 }}>
            <Typography variant="h4">History Request {lastRequests?.length}</Typography>
            {lastRequests?.length > 0 ? renderContent : renderEmpty}
        </Stack>
    )
}