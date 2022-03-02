/**
 * Gets called by index.js
 * 
 * returns a promise with json object
 */
function makeSearch(searchTerms, dataType, rowStart, rowCount) {

    return new Promise((resolve, reject) => {
        //storing the api response
        let apiResponse;

        //initialising empty json object to be displayed to the main page
        let results = [];

        /**
         * upon looking at CKAN's documentation, I don't think this is how the API request is supposed to work.
         * this will be a placeholder way until I can figure that out.
         * 
         * UPDATE:
         * the parameters for showing more than 10 results in json is the "start" and "rows" parameter
         * Link: https://solr.apache.org/guide/7_6/common-query-parameters.html
         */

        const XMLHttpRequest = require('xhr2');
        let request = new XMLHttpRequest();
        request.open("GET", `https://data.gov.uk/api/action/package_search?q=${searchTerms}&start=${rowStart}&rows=${rowCount}`);
        request.send();
        request.onload = () => {
            console.log(request);
            if (request.status == 200) {
                apiResponse = JSON.parse(request.response);
                console.log(apiResponse);

                //shorten "apiResponse.result" into "apiRes"
                let apiRes = apiResponse.result;

                /**
                 * Reformatting json parser to only return packages of data instead of individual sets
                 * 
                 * this will be needing a complete rewrite sometime in the future
                 */

                /**
                 * new code
                 */

                for (let i = 0; i < apiRes.results.length; i++) {
                    let hasFilteredType = dataType;

                    let dataTypes = [];

                    for (let j = 0; j < apiRes.results[i].resources.length; j++) {
                        // look through "resources" to see if a CSV exists
                        if (apiRes.results[i].resources[j].format === dataType) {
                            hasFilteredType = true;
                        }
                        let currentDataType = apiRes.results[i].resources[j].format;

                        // replacing empty formats with "undefined"

                        if (currentDataType === "") {
                            currentDataType = "undefined";
                        }

                        // boolean flag to check if duplicate file types exist

                        let isDuplicate = false;

                        for (let item of dataTypes) {
                            if (currentDataType == item) {
                                isDuplicate = true;
                            }
                        }

                        if (!isDuplicate) {
                            dataTypes.push(currentDataType);
                        }

                        if (hasFilteredType) {
                            let myObj = {
                                "title": `Title: ${apiRes.results[i].title}`,
                                "date_created": `Date Created: ${apiRes.results[i].metadata_created}`,
                                "date_modified": `Last Modified: ${apiRes.results[i].metadata_modified}`,
                                "licence": `Licence: ${apiRes.results[i].license_title}`,
                                "data_type": `Data Types: ${dataTypes.join(", ")}`,
                                "resources": `Number of Resources: ${apiRes.results[i].resources.length}`,
                                "package_id": apiRes.results[i].id
                            };
                            results.push(myObj);
                        }
                    }
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