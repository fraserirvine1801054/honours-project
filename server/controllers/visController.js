import { queryDbOnVisualisation } from "../scripts/mongocontrol";

const getVisData = async (req,res) => {
    console.log("viscontroller call");
    let dataId = req.params.dataid;

    try {
        let visObject = await queryDbOnVisualisation(dataId);
        res.json(visObject);
    } catch (err) {
        return res.status(400).json({
            message: err
        });
    }
}

export {
    getVisData
}