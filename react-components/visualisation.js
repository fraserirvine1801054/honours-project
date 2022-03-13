import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Typography, Box, Card, Cardheader } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

export default function Visualisation(props) {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const labels = props.xData

    const data = {
        labels,
        datasets: [
            {
                label: 'dataset 1',
                data: props.yData,
            }
        ]
    }


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
                <Line 
                    options={options}
                    data={data}
                />

            </Card>

        </Box>
    );
}
