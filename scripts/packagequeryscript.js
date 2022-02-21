/**
 * gets called by index.js
 * 
 * returns a promise with json object
 */
function queryPackage(packageId) {

    return new Promise((resolve, reject) => {
        var XMLHttpRequest = require('xhr2');
        let request = new XMLHttpRequest();
        request.open("GET", `https://ckan.publishing.service.gov.uk/api/action/package_show?id=${packageId}`);
        request.send();
        request.onload = () => {
            console.log(request);
            if (request.status == 200) {
                var apiResponse = JSON.parse(request.response);
                console.log(apiResponse);

                //parse package metadata into variables
                var packageTitle = apiResponse.result.title;
                var packageLicense = apiResponse.result.license_title;
                var packageCreationDate = apiResponse.result.metadata_created.split("T")[0];
                var packageModDate = apiResponse.result.metadata_modified.split("T")[0];

                //create object for package metadata to send to ejs
                //"p_" stands for "package"
                var packageMetaData = {
                    "p_title": packageTitle,
                    "p_licence": packageLicense,
                    "p_date_created": packageCreationDate,
                    "p_date_modified": packageModDate
                };

                //parse results into variable
                var resourceArray = apiResponse.result.resources;

                //instantiate array for containing datasets
                var datasets = [];

                //experiment with foreach loops
                resourceArray.forEach(item => {
                    //get dataset id:
                    var dataId = item.id;
                    //parse json into variables
                    var dataDescription = item.description;
                    var dataCreated = item.created;
                    var dataFormat = item.format;
                    var dataUrl = item.url;

                    var datasetObj = {
                        "description": `${dataDescription}`,
                        "date_created": `${dataCreated}`,
                        "data_format": `${dataFormat}`,
                        "data_url": `${dataUrl}`,
                        "data_id": `${dataId}`
                    };

                    datasets.push(datasetObj);
                });

                //make JSON
                var packageObj;
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