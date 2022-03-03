/**
 * Gets called by index.js
 * 
 * returns a promise with json object
 * 
 * Current Problems:
 * while the code below functions correctly.
 * the order in which packages are returned are random
 * Probable fix is to divide this into multiple async functions.
 */

//const { data } = require('jquery');
const mongocontrol = require("./mongocontrol")

function makeSearch(searchTerms, dataType, rowStart, rowCount) {

    return new Promise((resolve, reject) => {
        //storing the api response
        let apiResponse;

        /**
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

                const loopPromise = new Promise((resolve, reject) => {
                    //initialising empty json object to be displayed to the main page
                    let results = [];

                    let objCreated = 0;

                    for (let i = 0; i < apiRes.results.length; i++) {

                        let hasFilteredType = false;

                        let dataTypes = [];

                        // parsing API return for datatypes within package
                        for (let j = 0; j < apiRes.results[i].resources.length; j++) {

                            // look through "resources" to see if the filtered datatype exists
                            let currentDataType = apiRes.results[i].resources[j].format;

                            // replacing empty formats with "undefined"
                            if (currentDataType === "") {
                                currentDataType = "undefined";
                            }

                            if (currentDataType === dataType) {
                                hasFilteredType = true;
                            } else if (dataType === "ALL") {
                                hasFilteredType = true;
                            }

                            // boolean flag to check if duplicate file types exist

                            let isDuplicate = false;

                            for (let item of dataTypes) {
                                if (currentDataType === item) {
                                    isDuplicate = true;
                                }
                            }

                            if (!isDuplicate) {
                                dataTypes.push(currentDataType);
                            }
                        }

                        if (hasFilteredType) {
                            //check for if package has entry on database.
                            mongocontrol.queryDbOnPackageSearch(apiRes.results[i].id).then(cursor => {
                                console.log(cursor);
                                let packageHasDb = false;

                                if (cursor.length != 0) {
                                    packageHasDb = true;
                                } else {
                                    packageHasDb = false;
                                }

                                let hasDbText = "";
                                if (packageHasDb) {
                                    hasDbText = "View this package (Visualisation available)";
                                } else {
                                    hasDbText = "View this package";
                                }

                                console.log("creating search object")
                                let myObj = {
                                    "title": `Title: ${apiRes.results[i].title}`,
                                    "date_created": `Date Created: ${apiRes.results[i].metadata_created}`,
                                    "date_modified": `Last Modified: ${apiRes.results[i].metadata_modified}`,
                                    "licence": `Licence: ${apiRes.results[i].license_title}`,
                                    "data_type": `Data Types: ${dataTypes.join(", ")}`,
                                    "resources": `Number of Resources: ${apiRes.results[i].resources.length}`,
                                    "package_id": apiRes.results[i].id,
                                    "package_hasdb": packageHasDb,
                                    "package_hasdb_text": hasDbText
                                };
                                console.log("finished making search object")
                                results.push(myObj);
                                objCreated++
                                if (objCreated === apiRes.results.length) {
                                    resolve(results);
                                }
                            });
                        }
                    }
                });
                //return results;
                loopPromise.then((resultsList) => {
                    console.log("makesearch results return")
                    resolve(resultsList);
                });
            } else {
                //console.log(`error ${request.status} ${request.statusText}`);
                reject(`error ${request.status} ${request.statusText}`);
            }
        }
    });
}
exports.makeSearch = makeSearch;