//new code using express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { json } = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var router = express.Router();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;

var port = PORT;

//render the page in ejs
app.get('/', function(req,res){

    //roundabout way to render the main page with empty results
    var results = [
        {
            "title" : "",
            "date_created" : "",
            "date_modified" : "",
            "licence" : "",
            "data_type" : "",
            "resources" : "",
            "package_id" : ""
        }
    ];
    res.render('index.ejs', {results : results});
});

/*
old GET Query code:

app.get('/search', function(req,res){javascript run function from another file
    var queryKeywords = req.query.searchTerms;
    var queryDataType = req.query.dataType
    //debug
    console.log("DEBUG:\n" + 
                "SearchTerms: " + queryKeywords + "\n" +
                "dataType: " + queryDataType
    );
});
*/

var searchRouter = express.Router();

app.use(searchRouter);

//recieve form data
searchRouter.get('/search', function(req,res){
    console.log("search has been performed");
    //console.log(req.body);
    
    var searchTerms = req.query.searchTerms;
    var dataType = req.query.dataType;
    var rowStart = req.query.rowStart;
    var rowCount = req.query.rowCount;

    //extract object into individual strings
    //var searchTerms = req.body.searchTerms;
    //var dataType = req.body.dataType;
    
    //extract parameters for row start and row counts
    //var rowStart = req.body.rowStart;
    //var rowCount = req.body.rowCount;

    //reformat inputs from rowStart
    if (rowStart == ''){
        rowStart = 0;
    } else {
        rowStart = parseInt(rowStart);
    }
    
    //reformat inputs from rowCount
    if (rowCount == ''){
        rowCount = 10;
    } else {
        rowCount = parseInt(rowCount);
    }


    //var results = await searchScript.makeSearch(searchTerms,dataType,rowStart,rowCount);
    var searchScript = require("./scripts/searchscript");
    
    searchScript.makeSearch(searchTerms,dataType,rowStart,rowCount).then(
        results => {
            res.render('index.ejs', {results : results});
        }
    );

});


var packageViewRouter = express.Router();

app.use(packageViewRouter);

//redirect to package view page
packageViewRouter.get('/packageview', (req,res) => {

    //test page render
    console.log("test package view load");
    res.render('packageview.ejs');

});

packageViewRouter.get('/packageview/:packageid', (req,res) => {
    
    //Debug message for console
    console.log("test package view with params");
    console.log(`The parameter is: ${req.params.packageid}`);

    var packageQueryScript = require("./scripts/packagequeryscript");

    packageQueryScript.queryPackage(req.params.packageid).then(
        packageObj => {
            res.render('packageview.ejs', {packageObj : packageObj});
        }
    );
});

app.listen(PORT);
console.log('Express server running at http://127.0.0.1:'.PORT);

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
 */

// ===== old code being commented out =====
/*const http = require('http');
const fs = require('fs');
const express = require('express');


app.use(express.static('/public'));


const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
});

server.listen(process.env.PORT || 3000);
console.log('Server running at http://127.0.0.1:3000'); 
*/
