import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    Paper,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';

import { getVisualisationData } from './api-visualisation';

//import example for demo purposes only

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
import { Line } from 'react-chartjs-2';
import faker from '@faker-js/faker';





const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}));

export default function Visualisation({ match }) {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    const classes = useStyles();
    const [visData, setVisData] = useState([]);
    const [chartData, setChartData] = useState(data);


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Demo visualisation using react chartjs2',
            },
        },
    };


    useEffect(() => {

        const abortController = new AbortController();
        const signal = abortController.signal;

        getVisualisationData(signal, match.params.dataid).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
            } else {
                setVisData(data);
            }
        })

    }, [match.params.dataid]);

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h2'>
                Visualisation
            </Typography>
            {
                visData.length === 0 && (<span>
                    <Typography>
                        Error: Dataset does not contain visualisation
                    </Typography>
                </span>)
            }
            {
                visData.length > 0 && (<span>
                    <Card>
                        <CardHeader
                            title='Demo visualisation'
                        />
                        {console.log(chartData)}
                        <Line options={options} data={data} />
                    </Card>
                </span>)
            }
        </Paper>
    )

}