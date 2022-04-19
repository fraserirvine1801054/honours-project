import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    Paper
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

export default function PackageView({match}) {
    
    const classes = useStyles();

    useEffect(() => {

    }, [match.params.package_id])

    return(
        <Paper className={classes.root} elevation={4}>
            test packageview
        </Paper>
    )
}