/**
 * gets called by index.js
 * 
 * returns a promise with json object
 */
function queryPackage(packageId) {

    return new Promise((resolve, reject) => {
        const XMLHttpRequest = require('xhr2');
        let request = new XMLHttpRequest();
        request.open("GET", `https://ckan.publishing.service.gov.uk/api/action/package_show?id=${packageId}`);
        request.send();
        request.onload = () => {
            console.log(request);
            if (request.status == 200) {
                let apiResponse = JSON.parse(request.response);
                console.log(apiResponse);

                //parse package metadata into variables
                let packageTitle = apiResponse.result.title;
                let packageLicense = apiResponse.result.license_title;
                let packageCreationDate = apiResponse.result.metadata_created.split("T")[0];
                let packageModDate = apiResponse.result.metadata_modified.split("T")[0];

                //create object for package metadata to send to ejs
                //"p_" stands for "package"
                let packageMetaData = {
                    "p_title": packageTitle,
                    "p_licence": packageLicense,
                    "p_date_created": packageCreationDate,
                    "p_date_modified": packageModDate
                };

                //parse results into variable
                let resourceArray = apiResponse.result.resources;

                //instantiate array for containing datasets
                let datasets = [];

                //experiment with foreach loops
                resourceArray.forEach(item => {
                    //get dataset id:
                    let dataId = item.id;
                    //parse json into variables
                    let dataDescription = item.description;
                    let dataCreated = item.created;
                    let dataFormat = item.format;
                    let dataUrl = item.url;

                    let datasetObj = {
                        "description": `${dataDescription}`,
                        "date_created": `${dataCreated}`,
                        "data_format": `${dataFormat}`,
                        "data_url": `${dataUrl}`,
                        "data_id": `${dataId}`
                    };

                    datasets.push(datasetObj);
                });

                //make JSON
                let packageObj;
                packageObj = packageMetaData;
                packageObj.datasets = datasets;

                //test created json
                console.log(JSON.stringify(packageObj));

                //res.render('packageview.ejs', { packageObj: packageObj });
                resolve(packageObj);

            } else {
                //console.log(`error ${request.status} ${request.statusText}`);
                reject(`error ${request.status} ${request.statusText}`);
            }
        }
    });
}
exports.queryPackage = queryPackage;