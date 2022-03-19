import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { 
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button
} from '@mui/material';
import { Home as HomeIcon} from '@mui/icons-material';

const isActive = (history, path) => {
    if (history.location.pathname === path){
        return {color: '#ff4081'};
    } else {
        return {color: '#ffffff'};
    }
}
const Menu = withRouter(({history}) => {
    <AppBar position='static'>
        <Toolbar>
            <Typography variant='h6' color='inherit'>
                Honours Project
            </Typography>
            <Link to='/'>
                <IconButton aria-label='Home' style={isActive(history, '/')}>
                    <HomeIcon />
                </IconButton>
            </Link>
            <Link to='/insertdata'>
                <Button style={isActive(history, '/insertdata')}>DEBUG: Insert data</Button>
            </Link>
        </Toolbar>
    </AppBar>
});

export default Menu;