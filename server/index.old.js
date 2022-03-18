import 'core-js/stable';
import 'regenerator-runtime/runtime';

//new code using express
import express from 'express';
import bodyParser from 'body-parser';
//import { json } from 'body-parser';
import { Router } from 'express';
import path from 'path';
import devBundle from './devBundle';
import helmet, { contentSecurityPolicy } from 'helmet';
import cors from 'cors';

import Template from '../template';
import Visualisation from '../client/react-components/Visualise';

//esm imports 
import getChartData from './scripts/preparechartscript';
import { writeDb } from './scripts/mongocontrol';
import makeSearch from './scripts/searchscript';
import queryPackage from './scripts/packagequeryscript';
// new react imports
import userRoutes from './routes/user.routes';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MainRouter from '../client/MainRouter';
import {StaticRouter} from 'react-router-dom';
import {ServerStyleSheets, ThemeProvider} from '@mui/styles';
import theme from '../client/theme';

// set app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const router = Router();
app.use(router);
app.use(helmet());
app.use(cors());
app.set('view engine', 'ejs');
const CURRENT_WORKING_DIR = process.cwd();

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
devBundle.compile(app);

app.use('/', userRoutes);

const PORT = process.env.PORT || 8080;
//const MONGODB_URI = process.env.MONGODB_URI;

app.get('*', (req,res) => {
    const sheets = new ServerStyleSheets();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter/>
                </ThemeProvider>
            </StaticRouter>
        )
    );

    if (context.url) {
        return res.redirect(303, context.url);
    }

    const css = sheets.toString();

    res.status(200).send(Template({
        markup:markup,
        css:css
    }));

});

//old express code below:

//render the page in ejs
router.get('/', function (req, res) {

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

//recieve form data
router.get('/search', (req, res) => {
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

//redirect to package view page
router.get('/packageview', (req, res) => {

    //test page render
    console.log("test package view load");
    res.render('packageview.ejs');

});

router.get('/packageview/:packageid', (req, res) => {

    //Debug message for console
    console.log("test package view with params");
    console.log(`The parameter is: ${req.params.packageid}`);

    queryPackage(req.params.packageid).then(
        packageObj => {
            res.render('packageview.ejs', { packageObj: packageObj });
        }
    );
});

router.get('/insertdata', (req, res) => {

    res.render('insertdataview.ejs');

});

router.post('/insertdata', (req, res) => {

    console.log(`post test: ${req.body}`);


    writeDb(req.body);

});

router.get('/visualise/:dataid', (req, res) => {

    let data_id = req.params.dataid;


    getChartData(data_id, 0, 1).then(visObj => {
        console.log("degbugging vis obj");
        console.log(visObj);
        let css = ``;

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
