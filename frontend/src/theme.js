import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AC3', // Cor primária da UniCV
    },
    secondary: {
      main: '#FFC20E', // Cor secundária da UniCV
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Fonte da UniCV
  },
});

export default theme;