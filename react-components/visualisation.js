import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Typography, Box, Card, Cardheader } from '@mui/material';
import LineChart from './LineChart';
export default function Visualisation(props) {

    return (
        <Box>
            <AppBar position="static" sx={{
                background: '#5c5c5c'
            }}>
                <Typography variant="h5" component="div" sx={{
                    flexglow: 1,
                    marginLeft: 2
                }}>
                    Visualisation for: {props.description}
                </Typography>
            </AppBar>

            <Card>
                <LineChart />
            </Card>

        </Box>
    );
}
