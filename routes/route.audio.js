import express from 'express'
import searchSong from '../controllers/controller.audioSearch.js';

const audioRouter = express.Router();

audioRouter.get('/search',searchSong);

export default audioRouter;