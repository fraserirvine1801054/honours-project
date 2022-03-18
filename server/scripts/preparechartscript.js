import { queryDbOnVisualisation } from './mongocontrol';

export default async function getChartData(dataId, xColumn, yColumn) {
    //get the document json object
    console.log("test getchartdata called");
    let mongoJson = await getDocument(dataId);
    console.log("getdocument call");
    console.log(mongoJson);
    console.log("mongolist called");
    let visObject = await buildObject(mongoJson[0],xColumn,yColumn);
    console.log("visobject call");
    return visObject
}

/**
 * this function is slightly hardcoded
 * @param {*} rawJson 
 */
async function buildObject(rawJson,xColumn,yColumn){
    console.log("buildobj call");
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
    console.log("before cursor call");
    let cursor = await queryDbOnVisualisation(dataId);

    return cursor;
}