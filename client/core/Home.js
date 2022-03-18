import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/material';
import {
    Card,
    CardContent,
    CardMedia,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5)
    },
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    },
    credit: {
        padding: 10,
        textAlign: 'right',
        backgroundColor: '#ededed',
        borderBottom: '1px solid #d0d0d0',
        '& a':{
            color: '#3f4771'
        }
    }
}));

export default function Home() {
    const classes = useStyles();

    return(
        <Card className={classes.card}>
            <Typography variant='h6' className={classes.title}>
                Home Page
            </Typography>
            <CardContent>
                <Typography variant='body1' component='p'>
                    Welcome to the Honours Project home page.
                </Typography>
            </CardContent>
        </Card>
    );
}