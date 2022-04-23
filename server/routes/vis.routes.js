import express from 'express';
import dbCtrl from '../controllers/db.controller';
import { getVisData } from '../controllers/visController';

const router = express.Router();

router.route('/api/visualisation/:dataid')
    .get(getVisData);

export default router;