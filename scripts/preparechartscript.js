const mongocontrol = require('./mongocontrol');

async function getChartData(dataId, xColumn, yColumn) {
    //get the document json object
    let mongoJson = await getDocument(dataId);

    console.log(mongoJson[0]);
    
    let visObject = await buildObject(mongoJson[0],xColumn,yColumn);

    return visObject
}

/**
 * this function is slightly hardcoded
 * @param {*} rawJson 
 */
async function buildObject(rawJson,xColumn,yColumn){

    let myObj = {
        "vis_title" : rawJson.data_description,
        "vis_x_axis_title" : rawJson.data[xColumn].field_name,
        "vis_x_axis" : rawJson.data[xColumn].values,
        "vis_y_axis_title" : rawJson.data[yColumn].field_name,
        "vis_y_axis" : rawJson.data[yColumn].values
    };

    return myObj;

}

async function getDocument(dataId){
    //get the cursor from mongodb query
    let cursor = await mongocontrol.queryDbOnVisualisation(dataId);

    return cursor;
}

exports.getChartData = getChartData;