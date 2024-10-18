import { Autocomplete, Box, Card, CardContent, CardHeader, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useCallback } from 'react';
import Iconify from '../../../../components/iconify';
import Upload from '../../../../components/shadcn-ui/upload/upload';

export default function CreateSeminarStep2 ({
  file,
  setFile,
  duration,
  setDuration,
  title,
  setTitle,
}) {
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
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Seminar Info
            </Typography>

            <Grid container spacing={2} gap={3} sx={{ ml: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                <Grid item xs={12} sm={4}>
                    <Box sx={{
                      width: '100%',
                      mb: 3,
                    }}>
                        <Card>
                            <CardHeader title="Seminar Image" sx={{ color: '#637381' }} />
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
                <Grid item xs={12} sm={5}>
                    <Box sx={{
                      mb: 3,
                    }}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={title}
                            required
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Box>
                    <Box sx={{
                      mb: 3,
                      width: '40%',
                    }}>
                        <Select
                            value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={90}>1 hour 30 minutes</MenuItem>
                            <MenuItem value={120}>2 hours</MenuItem>
                            <MenuItem value={150}>2 hours 30 minutes</MenuItem>
                            <MenuItem value={180}>3 hours</MenuItem>
                        </Select>
                    </Box>
                </Grid>

            </Grid>
        </Box>
  );
};
