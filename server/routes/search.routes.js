import express from 'express';
import { getSearch } from '../controllers/searchController';

const router = express.Router();

router.route('/api/search')
    .get(getSearch);

export default router;