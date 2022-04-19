import makeSearch from "../scripts/searchscript"

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

export {
    getSearch
}