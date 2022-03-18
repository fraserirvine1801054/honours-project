import { extend } from "lodash";
import errorHandler from '../helpers/dbErrorHandler';
import { queryDbOnVisualisation } from "../scripts/mongocontrol";

const getvisdata = async (req,res,id) => {
    try {
        let visObject = await queryDbOnVisualisation(id);
        res.json(visObject);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

export default {
    getvisdata
}