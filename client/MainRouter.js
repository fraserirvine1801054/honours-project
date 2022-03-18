import React from 'react';
import {Route,Switch} from 'react-router-dom';
import { 
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    HomeIcon,
    Button,
} from '@mui/material';
import Menu from './core/Menu';

const MainRouter = () => {

    return(
        <div>
            <Menu />
            <Switch>
                <Route path='/visualise/:data_id' component={}/>
            </Switch>
        </div>
    );
}

export default MainRouter;