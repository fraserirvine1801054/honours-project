import express from 'express';
import { getSearch, getPackage } from '../controllers/searchController';

const router = express.Router();

router.route('/api/search')
    .get(getSearch);

router.route('/api/packageview/:package_id')
    .get(getPackage);

export default router;