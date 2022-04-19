import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import {Link, withRouter} from 'react-router-dom';

const isActive = (history, path) => {
    if (history.location.pathname === path){
        return {color: '#ff4081'};
    } else {
        return {color: '#ffffff'};
    }
}
const Menu = withRouter(({history}) => (
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
            <Link to='/search'>
                <Button style={isActive(history, '/search')}>search</Button>
            </Link>
            <Link to='/insertdata'>
                <Button style={isActive(history, '/insertdata')}>DEBUG: Insert data</Button>
            </Link>
        </Toolbar>
    </AppBar>
));

export default Menu;