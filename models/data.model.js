/**
 * defining a Schema for sending to mongo atlas
 * 
 * currently doesn't do anything
 */
import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({

    data_id: {
        type: String,
        required: 'A data ID is required'
    },
    data_file: {
        type: String,
        required: 'A data file is required'
    }

});

const dataModel = mongoose.model('', dataSchema);
dataModel.createIndexes();

//export
export default dataModel;