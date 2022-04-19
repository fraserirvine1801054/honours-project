import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
    Button
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

export default function SearchPage({ match }) {

    const classes = useStyles();
    const [searchReturns, setSearchReturns] = useState([]);
    const [values, setValues] = useState({
        search_terms: '',
        data_type: '',
        row_start: 0,
        row_count: 10
    });

    useEffect(() => {
        console.log(values);
    }, []);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }

    const clickSubmit = () => {
        console.log(values);
    }

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h2'>
                Search Page
            </Typography>
            <Card>
                <CardContent>
                    
                    <FormControl
                        component='fieldset'
                    >
                        <TextField
                            id='search_terms'
                            label='Search by Keywords/Location'
                            value={values.search_terms}
                            onChange={handleChange('search_terms')}
                        />
                        <RadioGroup
                            name="data-type-radio-group"
                            value={values.data_type}
                            onChange={handleChange('data_type')}
                        >
                            <FormControlLabel
                                value='CSV'
                                control={<Radio />}
                                label='CSV (Comma Separated Values)'
                            />
                            <FormControlLabel
                                value='ESRI_REST'
                                control={<Radio />}
                                label='ESRI REST'
                            />
                            <FormControlLabel
                                value='HTML'
                                control={<Radio />}
                                label='HTML'
                            />
                            <FormControlLabel
                                value='ALL'
                                control={<Radio />}
                                label='Show All'
                            />
                        </RadioGroup>
                        <TextField
                            id='row_start'
                            label='Show results from start of row index'
                            type='number'
                            value={values.row_start}
                            defaultValue={0}
                            onChange={handleChange('row_start')}
                        />
                        <TextField
                            id='row_count'
                            label='The count of how many rows'
                            type='number'
                            value={values.row_count}
                            defaultValue={10}
                            onChange={handleChange('row_count')}
                        />
                    </FormControl>
                    <br/>
                    <br/>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={() => { clickSubmit() }}
                    >
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </Paper>
    )
}