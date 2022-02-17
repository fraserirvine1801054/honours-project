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
            "data_url" : ""
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
    
    //storing the api response
    var apiResponse;

    //initialising empty json object to be displayed to the main page
    var results = [];

    /**
     * upon looking at CKAN's documentation, I don't think this is how the API request is supposed to work.
     * this will be a placeholder way until I can figure that out.
     */
    var XMLHttpRequest = require('xhr2');
    let request = new XMLHttpRequest();
    request.open("GET", `https://data.gov.uk/api/action/package_search?q=${searchTerms}`);
    request.send();
    request.onload = () => {
        console.log(request);
        if (request.status == 200) {
            apiResponse = JSON.parse(request.response);
            console.log(apiResponse);

            //testing javascript json
            //console.log(apiResponse.success);
            //console.log(apiResponse.result.results[0].resources[0].format);

            //very roundabout way to filter JSON. May change in the future

            switch(dataType){
                case "CSV":
                    for (var i = 0; i < apiResponse.result.results.length; i++) {
                        for (var j = 0; j < apiResponse.result.results[i].resources.length; j++) {

                            if (apiResponse.result.results[i].resources[j].format === "CSV"){
                                var myObj = {
                                    "title" : `Title: ${apiResponse.result.results[i].title}`,
                                    "date_created" : `Date Created: ${apiResponse.result.results[i].metadata_created}`,
                                    "date_modified" : `Last Modified: ${apiResponse.result.results[i].metadata_modified}`,
                                    "licence" : `Licence: ${apiResponse.result.results[i].license_title}`,
                                    "data_type" : `Data Type: CSV`,
                                    "data_url" : `Data URL: ${apiResponse.result.results[i].resources[j].url}`
                                };
                                results.push(myObj);
                            }
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
                        for (var j = 0; j < apiResponse.result.results[i].resources.length; j++) {
                            var jsonFormatValue;
                            if (typeof apiResponse.result.results[i].resources[j].format === 'undefined'){
                                jsonFormatValue = "undefined";
                            } else {
                                jsonFormatValue = apiResponse.result.results[i].resources[j].format;
                            }
                            
                            var myObj = {
                                "title" : `Title: ${apiResponse.result.results[i].title}`,
                                "date_created" : `Date Created: ${apiResponse.result.results[i].metadata_created}`,
                                "date_modified" : `Last Modified: ${apiResponse.result.results[i].metadata_modified}`,
                                "licence" : `Licence: ${apiResponse.result.results[i].license_title}`,
                                "data_type" : `Data Type: ${jsonFormatValue}`,
                                "data_url" : `Data URL: ${apiResponse.result.results[i].resources[j].url}`
                            };
                            results.push(myObj);
                        }   
                    }
                    break;
            }

            res.render('index.ejs', {results : results});

        } else {
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
    
    /*
    //run python script to query data.gov.uk api
    let {PythonShell} = require('python-shell');

    let options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: 'pythonscripts',
        args: [JSON.stringify(req.body)]
    };

    PythonShell.run('query_api.py', options, function(err, results){
        if (err) throw err;
        console.log('results: %j', results);
    });
    */

    /*
    pyshell.on('message', function(message){
        console.log(message);
    });
    */
    //return res.redirect('/');
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
