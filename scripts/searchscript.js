/**
 * Gets called by index.js
 * 
 * returns a promise with json object
 */
function makeSearch(searchTerms, dataType, rowStart, rowCount) {

    return new Promise((resolve, reject) => {
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

                /**
                 * Reformatting json parser to only return packages of data instead of individual sets
                 * 
                 * this will be needing a complete rewrite sometime in the future
                 */

                switch (dataType) {
                    case "CSV":
                        for (var i = 0; i < apiResponse.result.results.length; i++) {

                            //boolean to check if a CSV has been found in this package.
                            var hasCSV;

                            //array to store datatypes found in the package
                            var dataTypes = [];

                            for (var j = 0; j < apiResponse.result.results[i].resources.length; j++) {
                                //look through "resources" to see if a CSV exists
                                if (apiResponse.result.results[i].resources[j].format === "CSV") {
                                    hasCSV = true;
                                }
                                var currentDataType = apiResponse.result.results[i].resources[j].format;

                                //replacing empty formats with "undefined"
                                if (currentDataType === "") {
                                    currentDataType = "undefined";
                                }

                                //boolean flag to check if a duplicate exists
                                var isDuplicate = false;

                                for (var item of dataTypes) {
                                    if (currentDataType == item) {
                                        isDuplicate = true;
                                    }
                                }

                                if (!isDuplicate) {
                                    dataTypes.push(currentDataType);
                                }
                            }

                            if (hasCSV) {
                                var myObj = {
                                    "title": `Title: ${apiResponse.result.results[i].title}`,
                                    "date_created": `Date Created: ${apiResponse.result.results[i].metadata_created}`,
                                    "date_modified": `Last Modified: ${apiResponse.result.results[i].metadata_modified}`,
                                    "licence": `Licence: ${apiResponse.result.results[i].license_title}`,
                                    "data_type": `Data Types: ${dataTypes.join(", ")}`,
                                    "resources": `Number of Resources: ${apiResponse.result.results[i].resources.length}`,
                                    "package_id": apiResponse.result.results[i].id
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

                                for (var item of dataTypes) {
                                    if (currentDataType == item) {
                                        isDuplicate = true;
                                    }
                                }

                                if (!isDuplicate) {
                                    dataTypes.push(currentDataType);
                                }

                            }
                            var myObj = {
                                "title": `Title: ${apiResponse.result.results[i].title}`,
                                "date_created": `Date Created: ${apiResponse.result.results[i].metadata_created}`,
                                "date_modified": `Last Modified: ${apiResponse.result.results[i].metadata_modified}`,
                                "licence": `Licence: ${apiResponse.result.results[i].license_title}`,
                                "data_type": `Data Types: ${dataTypes.join(", ")}`,
                                "resources": `Number of Resources: ${apiResponse.result.results[i].resources.length}`,
                                "package_id": apiResponse.result.results[i].id
                            };
                            results.push(myObj);
                        }
                        break;
                }

                //res.render('index.ejs', {results : results});


                console.log("makesearch results return")
                //return results;
                resolve(results);

            } else {
                //console.log(`error ${request.status} ${request.statusText}`);
                reject(`error ${request.status} ${request.statusText}`);
            }
        }
    });
}
exports.makeSearch = makeSearch;