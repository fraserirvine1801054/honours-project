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
            "resources" : ""
        }
    ];

    res.render('index.ejs', {results : results});
});

//get query (unused)
/*
app.get('/search', function(req,res){
    var queryKeywords = req.query.searchTerms;
    var queryDataType = req.query.dataType
    //debug
    console.log("DEBUG:\n" + 
                "SearchTerms: " + queryKeywords + "\n" +
                "dataType: " + queryDataType
    );
});
*/

//recieve form data
app.post('/search', function(req,res){
    console.log("search has been performed");
    console.log(req.body);
    
    //extract object into individual strings
    var searchTerms = req.body.searchTerms;
    var dataType = req.body.dataType;
    
    //extract parameters for row start and row counts
    var rowStart = req.body.rowStart;
    var rowCount = req.body.rowCount;

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

    //storing the api response
    var apiResponse;

    //initialising empty json object to be displayed to the main page
    var results = [];

    /**
     * upon looking at CKAN's documentation, I don't think this is how the API request is supposed to work.
     * this will be a placeholder way until I can figure that out.
     * 
     * UPDATE:
     * the parameters for showing more than 10 results in json is the "start" and "rows" parameter
     * Link: https://solr.apache.org/guide/7_6/common-query-parameters.html
     */

    var XMLHttpRequest = require('xhr2');
    let request = new XMLHttpRequest();
    request.open("GET", `https://data.gov.uk/api/action/package_search?q=${searchTerms}&start=${rowStart}&rows=${rowCount}`);
    request.send();
    request.onload = () => {
        console.log(request);
        if (request.status == 200) {
            apiResponse = JSON.parse(request.response);
            console.log(apiResponse);

            //testing javascript json
            //console.log(apiResponse.success);
            //console.log(apiResponse.result.results[0].resources[0].format);

            /**
             * Reformatting json parser to only return packages of data instead of individual sets
             * 
             * this will be needing a complete rewrite sometime in the future
             */
            switch(dataType){
                case "CSV":
                    for (var i = 0; i < apiResponse.result.results.length; i++) {

                        //boolean to check if a CSV has been found in this package.
                        var hasCSV;

                        //array to store datatypes found in the package
                        var dataTypes = [];

                        for (var j = 0; j < apiResponse.result.results[i].resources.length; j++) {
                            //look through "resources" to see if a CSV exists
                            if (apiResponse.result.results[i].resources[j].format === "CSV"){
                                hasCSV = true;
                            }
                            var currentDataType = apiResponse.result.results[i].resources[j].format;
                            
                            //replacing empty formats with "undefined"
                            if (currentDataType === "") {
                                currentDataType = "undefined";
                            }

                            //boolean flag to check if a duplicate exists
                            var isDuplicate = false;

                            for (var item of dataTypes){
                                if (currentDataType == item){
                                    isDuplicate = true;
                                }
                            }
                            
                            if (!isDuplicate) {
                                dataTypes.push(currentDataType);
                            }
                        }

                        if (hasCSV) {
                            var myObj = {
                                "title" : `Title: ${apiResponse.result.results[i].title}`,
                                "date_created" : `Date Created: ${apiResponse.result.results[i].metadata_created}`,
                                "date_modified" : `Last Modified: ${apiResponse.result.results[i].metadata_modified}`,
                                "licence" : `Licence: ${apiResponse.result.results[i].license_title}`,
                                "data_type" : `Data Types: ${dataTypes.join(", ")}`,
                                "resources" : `Number of Resources: ${apiResponse.result.results[i].resources.length}`
                            };
                            results.push(myObj);
                        }
                    }
                    break;
                case "GEO":
                    /**
                     * Geographical data is formatted very strangely in data.gov.uk API
                     * it will be ignored for the proof of concept
                     */
                    break;
                case "ALL":
                    for (var i = 0; i < apiResponse.result.results.length; i++) {
                        
                        //array to store data types found in this dataset
                        var dataTypes = [];
                        
                        for (var j = 0; j < apiResponse.result.results[i].resources.length; j++) {
                            
                            var currentDataType = apiResponse.result.results[i].resources[j].format;

                            //replacing empty formats with "undefined"
                            if (currentDataType === "") {
                                currentDataType = "undefined";
                            }

                            //boolean flag to check if a duplicate element exists
                            var isDuplicate = false;

                            for (var item of dataTypes){
                                if (currentDataType == item){
                                    isDuplicate = true;
                                }
                            }
                            
                            if (!isDuplicate) {
                                dataTypes.push(currentDataType);
                            }
                            
                        }   
                        var myObj = {
                            "title" : `Title: ${apiResponse.result.results[i].title}`,
                            "date_created" : `Date Created: ${apiResponse.result.results[i].metadata_created}`,
                            "date_modified" : `Last Modified: ${apiResponse.result.results[i].metadata_modified}`,
                            "licence" : `Licence: ${apiResponse.result.results[i].license_title}`,
                            "data_type" : `Data Types: ${dataTypes.join(", ")}`,
                            "resources" : `Number of Resources: ${apiResponse.result.results[i].resources.length}`   
                        };
                        results.push(myObj);
                    }
                    break;
            }

            res.render('index.ejs', {results : results});

        } else {
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
    
});

app.listen(PORT);
console.log('Express server running at http://127.0.0.1:'.PORT);

/**
 * Resources used:
 * https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
 * https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express
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
