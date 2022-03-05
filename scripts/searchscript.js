/**
 * Gets called by index.js
 * 
 * returns a promise with json object
 */

const mongocontrol = require("./mongocontrol")

async function makeSearch(searchTerms, dataType, rowStart, rowCount) {
    //storing the api response

    let apiResponse = await getApiJson(searchTerms, rowStart, rowCount);
 
    console.log("[debug] api response log in makesearch");
    console.log(apiResponse);

    //shorten "apiResponse.result" into "apiRes"
    let apiRes = apiResponse.result;

    let results = await getDisplayObject(apiRes, dataType);

    console.log("makesearch results return");
    return results;
}

async function getDisplayObject(apiRes, dataType) {
    let results = [];

    for (let i = 0; i < apiRes.results.length; i++) {
        // parsing API return for datatypes within package
        let dataTypeObject = await parseDataTypes(apiRes.results[i].resources, dataType);
        let myObj = await getPackageObject(apiRes.results[i], dataTypeObject);
        results.push(myObj);
    }

    return results;
}

function getApiJson(searchTerms, rowStart, rowCount) {

    /**
     * the parameters for showing more than 10 results in json is the "start" and "rows" parameter
     * Link: https://solr.apache.org/guide/7_6/common-query-parameters.html
     */

    return new Promise((resolve, reject) => {
        const XMLHttpRequest = require('xhr2');
        let request = new XMLHttpRequest();
        request.open("GET", `https://data.gov.uk/api/action/package_search?q=${searchTerms}&start=${rowStart}&rows=${rowCount}`);
        request.send();
        request.onload = () => {
            console.log("[debug] request log in getApiJson");
            console.log(request);
            if (request.status === 200) {
                let apiResponse = JSON.parse(request.response);
                console.log(apiResponse);
                resolve(apiResponse);
            } else {
                console.log(`error ${request.status} ${request.statusText}`);
                reject(`error ${request.status} ${request.statusText}`);
            }
        }
    });
}

async function parseDataTypes(theJson, dataType) {
    let hasFilteredType = false;

    let dataTypes = [];

    for (let i = 0; i < theJson.length; i++) {
        let currentDataType = theJson[i].format;

        if (currentDataType === "") {
            currentDataType = "undefined";
        }

        if (currentDataType === dataType) {
            hasFilteredType = true;
        } else if (dataType === "ALL") {
            hasFilteredType = true;
        }

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

    return Promise.resolve({
        hasFilteredType: hasFilteredType,
        dataTypes: dataTypes
    });
}

async function getPackageObject(apiObject, dataTypeObject) {

    if (dataTypeObject.hasFilteredType) {

        let cursor = await mongocontrol.queryDbOnPackageSearch(apiObject.id);
        console.log(cursor);
        let packageHasDb = false;

        if (cursor.length !== 0) {
            packageHasDb = true;
        } else {
            packageHasDb = false;
        }

        let hasDbText = "";
        if (packageHasDb) {
            hasDbText = "View this Package (Visualisation Available)";
        } else {
            hasDbText = "View this Package";
        }

        console.log("creating search object");
        let myObj = {
            "title": `Title: ${apiObject.title}`,
            "date_created": `Date Created: ${apiObject.metadata_created}`,
            "date_modified": `Last Modified: ${apiObject.metadata_modified}`,
            "licence": `Licence: ${apiObject.license_title}`,
            "data_type": `Data Types: ${dataTypeObject.dataTypes}`,
            "resources": `Number of Resources: ${apiObject.resources.length}`,
            "package_id": apiObject.id,
            "package_hasdb": packageHasDb,
            "package_hasdb_text": hasDbText
        };
        console.log("completed search object");

        return Promise.resolve(myObj);

    }
}
exports.makeSearch = makeSearch;
