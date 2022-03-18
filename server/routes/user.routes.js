import express from 'express';
import dbCtrl from '../controllers/db.controller';

const router = express.Router();

router.route('/api/getvisdata')
    .get(dbCtrl.getvisdata);

export default router;