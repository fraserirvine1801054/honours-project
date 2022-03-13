import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';

export default function Visualisation(props) {
    return(
        <AppBar position="static">
            <Typography variant="h6" component="div" sx={{flexglow:1}}>
                Visualisation for: {props.description}
            </Typography>
        </AppBar>
    );
}
