import express from 'express'
import searchSong from '../controllers/controller.audioSearch.js';
import downloadSong from '../controllers/controller.audioDownload.js';

const audioRouter = express.Router();

audioRouter.get('/search',searchSong);
audioRouter.get('/download',downloadSong)

export default audioRouter;