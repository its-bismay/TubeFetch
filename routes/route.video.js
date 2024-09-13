import express from 'express'
import searchVideo from '../controllers/controller.videoSearch.js';

const videoRouter = express.Router();

videoRouter.get('/search',searchVideo);

export default videoRouter;