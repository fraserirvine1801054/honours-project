import React from 'react';
import MainRouter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/private-theming';
import {hot} from 'react-hot-loader';
import theme from './theme';


const App = () => {

    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    return(
        <BrowserRouter>
            <ThemeProvider theme = {theme}>
                <MainRouter />
            </ThemeProvider>
        </BrowserRouter>
    )

}