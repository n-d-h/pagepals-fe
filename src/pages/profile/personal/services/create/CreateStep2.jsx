import { Autocomplete, Box, Card, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import Iconify from "../../../../../components/iconify";
import Upload from "../../../../../components/shadcn-ui/upload/upload";
import { useCallback } from "react";


export default function CreateStep2({
    data,
    loading,
    revenueShared,
    file,
    setFile,
    serviceType,
    setServiceType,
    price,
    setPrice,
    shortDescription,
    setShortDescription
}) {
    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const newFile = acceptedFiles[0];
        if (newFile) {
            setFile(
                Object.assign(newFile, {
                    preview: URL.createObjectURL(newFile),
                })
            );
        }
    }, [setFile]);
    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Service Info
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'start',
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 150,
                        }}>
                            <Iconify icon="bi:clock" width={20} height={20} color="#637381" />
                            <Typography variant="body1" color={'#637381'} textAlign={"center"} fontWeight={600}>60 minutes</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#637381", fontSize: 12 }}>
                            Every service is 60 minutes long
                        </Typography>
                    </Box>
                    <Box sx={{
                        mb: 3
                    }}>
                        <Autocomplete
                            fullWidth
                            options={data?.getListServiceType || []}
                            getOptionLabel={(option) => option.name}
                            value={serviceType}
                            isOptionEqualToValue={(option, value) => {
                                return option?.id === value?.id;
                            }}
                            loading={loading}
                            onChange={(e, value) => {
                                setServiceType(value);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Service Type"
                                    name="serviceType"
                                    required
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{
                        mb: 3
                    }}>
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                            type="number"
                            required
                            helperText=
                            {`Income will be deducted ${revenueShared}% of the total price.`}
                            InputProps={{
                                endAdornment: <Typography color={'green'} variant="subtitle1">pals</Typography>,
                            }}
                        />
                    </Box>
                    <Box sx={{
                        mb: 3
                    }}>
                        <TextField
                            fullWidth
                            label="Short Description"
                            name="shortDescription"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            multiline
                            required
                            helperText=
                            {`length: ${shortDescription?.length || 0}/120`}
                            FormHelperTextProps={{
                                sx: {
                                    textAlign: 'right'
                                }
                            }}
                            inputProps={{ maxLength: 120 }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{
                        width: '70%',
                    }}>
                        <Card>
                            <CardHeader title="Service Image" />
                            <CardContent>
                                <Upload
                                    file={file}
                                    maxSize={3145728}
                                    onDrop={handleDropSingleFile}
                                    onDelete={() => setFile(null)} />
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
};