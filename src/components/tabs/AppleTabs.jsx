import { Tabs, styled } from '@mui/material';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '&.MuiTabs-root': {
    borderRadius: '16px',
    backgroundColor: theme.palette.background.paper,

    padding: '4px',
    '& .MuiTab-root.Mui-selected': {
      zIndex: 1,
      transition: 'all 0.3s ease',
    },
  },
  '& .MuiTabs-indicator': {
    borderRadius: '8px',
    height: '100%',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.16)',
  },
}));

export default function AppleTabsTemplate (props) {
  return <StyledTabs {...props}>{props.children}</StyledTabs>;
}
