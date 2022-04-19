import makeSearch from "../scripts/searchscript"
import queryPackage from "../scripts/packagequeryscript";

const getSearch = async (req,res) => {
    //extract query params
    console.log("getsearchcall");
    let searchTerms = req.query.searchTerms;
    let dataType = req.query.dataType;
    let rowStart = req.query.rowStart;
    let rowCount = req.query.rowCount;


    try {
        let searchReturns = await makeSearch(searchTerms,dataType,rowStart,rowCount);
        res.json(searchReturns);
    } catch (err) {
        return res.status(400).json({
            error: "error in getSearch()"
        });
    }
}

const getPackage = async (req,res) => {
    let packageId = req.params.package_id;

    try {
        let packageObj = await queryPackage(packageId);
        res.json(packageObj);
    } catch (err) {
        return res.status(400).json({
            error: "error in getPackage()"
        });
    }
}

export {
    getSearch,
    getPackage
}