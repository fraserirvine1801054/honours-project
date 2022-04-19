import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getPackage } from './api-packageview';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Button,
    Grid,
    CardHeader
} from '@material-ui/core';

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

export default function PackageView({ match }) {

    const classes = useStyles();
    const [currentPackage, setCurrentPackage] = useState({});
    const [dataIsLoaded, setDataIsLoaded] = useState({});

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        getPackage(signal, match.params.package_id).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
                setDataIsLoaded({ isLoaded: false })
            } else {
                setCurrentPackage(data);
                setDataIsLoaded({ isLoaded: true })
            }
        });

    }, [match.params.package_id])

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h2'>
                Package View
            </Typography>
            {console.log(currentPackage)}
            {
                dataIsLoaded.isLoaded && (<span>
                    <Card>
                        <CardHeader
                            title={currentPackage.p_title}
                            subheader={'Date Created: ' + currentPackage.p_date_created + ' Date last Modified: ' + currentPackage.p_date_modified}
                        />
                        <CardContent>
                            <Typography>
                                {'License: ' + currentPackage.p_licence}
                            </Typography>
                            <Typography>
                                {'Package ID: ' + currentPackage.p_package_Id}
                            </Typography>
                        </CardContent>
                    </Card>
                    <br />
                    <Grid
                        container
                        direction='column'
                        spacing={2}
                    >
                        {currentPackage.datasets.map((item, i) => {
                            return (
                                <Grid item key={i}>
                                    <Card elevation={2}>
                                        <CardHeader
                                            title={item.description}
                                        />
                                        <CardContent>
                                            <Typography>
                                                {'Data Type: ' + item.data_format}
                                            </Typography>
                                            <Typography>
                                                {'Data ID: ' + item.data_id}
                                            </Typography>
                                            <Typography>
                                                {'Original URL: '} <a href={item.data_url} target="_blank">{item.data_url}</a>
                                            </Typography>
                                            <Link to={`/visualise/${item.data_id}`}>
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    size='small'
                                                >
                                                    Visualise this Data
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>

                </span>)
            }
        </Paper>
    )
}