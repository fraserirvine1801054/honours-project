import 'core-js/stable';
import 'regenerator-runtime/runtime';

//new code using express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const router = express.Router();

import React from 'react';
import reactDom from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import Template from './template';
import Visualisation from './react-components/visualisation';

//esm imports 
import getChartData from './scripts/preparechartscript';
import { writeDb } from './scripts/mongocontrol';
import makeSearch from './scripts/searchscript';
import queryPackage from './scripts/packagequeryscript';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

//render the page in ejs
app.get('/', function (req, res) {

    //roundabout way to render the main page with empty results
    let results = [
        {
            "title": "",
            "date_created": "",
            "date_modified": "",
            "licence": "",
            "data_type": "",
            "resources": "",
            "package_id": "",
            "package_hasdb": false,
            "package_hasdb_text": ""
        }
    ];
    res.render('index.ejs', { results: results });
});

const searchRouter = express.Router();

app.use(searchRouter);

//recieve form data
searchRouter.get('/search', (req, res) => {
    console.log("search has been performed");

    let searchTerms = req.query.searchTerms;
    let dataType = req.query.dataType;
    let rowStart = req.query.rowStart;
    let rowCount = req.query.rowCount;

    //convert empty parameters to default numbers
    if (rowStart == '') {
        rowStart = 0;
    } else {
        rowStart = parseInt(rowStart);
    }

    if (rowCount == '') {
        rowCount = 10;
    } else {
        rowCount = parseInt(rowCount);
    }

    //let results = searchScript.makeSearch(searchTerms, dataType, rowStart, rowCount);
    makeSearch(searchTerms, dataType, rowStart, rowCount).then(results => {
        console.log(results);
        res.render('index.ejs', { results: results });
    })

});

const packageViewRouter = express.Router();

app.use(packageViewRouter);

//redirect to package view page
packageViewRouter.get('/packageview', (req, res) => {

    //test page render
    console.log("test package view load");
    res.render('packageview.ejs');

});

packageViewRouter.get('/packageview/:packageid', (req, res) => {

    //Debug message for console
    console.log("test package view with params");
    console.log(`The parameter is: ${req.params.packageid}`);

    queryPackage(req.params.packageid).then(
        packageObj => {
            res.render('packageview.ejs', { packageObj: packageObj });
        }
    );
});

const insertDataRouter = express.Router();

app.use(insertDataRouter);

insertDataRouter.get('/insertdata', (req, res) => {

    res.render('insertdataview.ejs');

});

insertDataRouter.post('/insertdata', (req, res) => {

    console.log(`post test: ${req.body}`);


    writeDb(req.body);

});

const visDataRouter = express.Router();

app.use(visDataRouter);

visDataRouter.get('/visualise/:dataid', (req, res) => {

    let data_id = req.params.dataid;








    getChartData(data_id, 0, 1).then(visObj => {
        console.log("degbugging vis obj");
        console.log(visObj);
        let css = `
        `;

        const markup = ReactDOMServer.renderToString(
            <Visualisation
                description="test desc"
                xData={visObj.vis_x_axis}
                yData={visObj.vis_y_axis}

            />
        );

        res.status(200).send(Template({
            markup: markup,
            css: css
        }));

    });







});

app.listen(PORT);
console.log(`Express server running at http://127.0.0.1:${PORT}`);

/**
 * Resources used:
 * https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
 * https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express
 * https://guidance.data.gov.uk/get_data/api_documentation/#api-documentation
 * https://solr.apache.org/guide/7_6/common-query-parameters.html
 * https://www.youtube.com/watch?v=DHvZLI7Db8E
 *
 * https://campusmoodle.rgu.ac.uk/pluginfile.php/5760308/mod_resource/content/2/GettingStarted.pdf
 * 
 * Charting libraries:
 * https://apexcharts.com/
 * 
 * Pinned datasets:
 * https://data.gov.uk/dataset/da9a88d6-6535-4c7f-8d54-a93a50b2f177/the-national-archives-energy-consumption
 */
