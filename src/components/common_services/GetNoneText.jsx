import { Typography } from '@mui/material';

export function getNoneText (text) {
  return (
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ fontStyle: 'italic' }}
        fontSize={'10px'}
      >
        {text || '(None)'}
      </Typography>
  );
}
