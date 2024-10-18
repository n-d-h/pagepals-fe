import { Autocomplete, Box, Card, CardContent, CardHeader, Grid, IconButton, Paper, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useCallback } from "react";
import Upload from "../../../../../../components/shadcn-ui/upload/upload";
import { uniqueLanguages } from "../../../data";
import { he } from "date-fns/locale";
import Iconify from "../../../../../../components/iconify";

export default function CreateStep1Tab2({ book, setBook, file, setFile }) {
    const handleLanguageChange = (event, value) => {
        setBook({
            ...book,
            volumeInfo: {
                ...book.volumeInfo,
                language: value,
            },
        });
    };
    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const newFile = acceptedFiles[0];
        if (newFile) {
            setFile(
                Object.assign(newFile, {
                    preview: URL.createObjectURL(newFile),
                }),
            );
        }
    }, [setFile]);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
                <Paper>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Book Title"
                                value={book?.volumeInfo?.title}
                                onChange={(e) =>
                                    setBook({
                                        ...book,
                                        volumeInfo: {
                                            ...book.volumeInfo,
                                            title: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                fullWidth
                                label="Authors"
                                value={book?.volumeInfo?.authors}
                                onChange={(e) => setBook({
                                    ...book,
                                    volumeInfo: {
                                        ...book.volumeInfo,
                                        authors: e.target.value.split(',').map((author) => author),
                                    },
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                fullWidth
                                label="Categories"
                                value={book?.volumeInfo?.categories}
                                onChange={(e) => setBook({
                                    ...book,
                                    volumeInfo: {
                                        ...book.volumeInfo,
                                        categories: e.target.value.split(',').map((cate) => cate),
                                    },
                                })}
                            >
                            </TextField>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Autocomplete
                                name="language"
                                label="Language"
                                options={uniqueLanguages}
                                getOptionLabel={(option) => option}
                                onChange={handleLanguageChange}
                                value={book?.volumeInfo?.language}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderInput={(params) => (
                                    <TextField label={'Language'} {...params} />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Page Count"
                                value={book?.volumeInfo?.pageCount}
                                onChange={(e) =>
                                    setBook({
                                        ...book,
                                        volumeInfo: {
                                            ...book.volumeInfo,
                                            pageCount: parseInt(e.target.value),
                                        },
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    openTo="year"
                                    views={['year', 'month', 'day']}
                                    label="Published Date"
                                    value={book?.volumeInfo?.publishedDate}
                                    onChange={(newValue) => {
                                        setBook({
                                            ...book,
                                            volumeInfo: {
                                                ...book.volumeInfo,
                                                publishedDate: moment(newValue).format('YYYY-MM-DD'),
                                            },
                                        })
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'none',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Publisher"
                                value={book?.volumeInfo?.publisher}
                                onChange={(e) =>
                                    setBook({
                                        ...book,
                                        volumeInfo: {
                                            ...book.volumeInfo,
                                            publisher: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={book?.volumeInfo?.description}
                                multiline
                                onChange={(e) =>
                                    setBook({
                                        ...book,
                                        volumeInfo: {
                                            ...book.volumeInfo,
                                            description: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
                <Card>
                    <CardHeader title="Book Image" sx={{ color: '#637381' }} />
                    <CardContent>
                        {!file && (
                            <Upload
                                file={file}
                                maxSize={3145728}
                                onDrop={handleDropSingleFile}
                                onDelete={() => setFile(null)} />
                        )}
                        {file && (
                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                                }}
                            >
                                <img
                                    src={file.preview}
                                    alt="Preview"
                                    style={{
                                        height: '350px',
                                        width: 'auto',
                                        objectFit: 'contain',
                                        border: '1px solid #e0e0e0',
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 27,
                                        right: 35,
                                        // black background with white text
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        color: 'white',
                                        opacity: 0.8,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        },
                                        padding: 0.2,
                                    }}
                                    onClick={() => setFile(null)}
                                >
                                    <Iconify icon="iconamoon:close-duotone" color="error" width={17} height={17} />
                                </IconButton>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    );
};