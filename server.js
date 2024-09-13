import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import ytdl from '@distube/ytdl-core';


const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get('/search', (req, res) => {
    const videoUrl = req.body.url; // Get the video URL from the query parameters

    if (!videoUrl) {
        return res.status(400).send('Video URL is required');
    }

    // Set the appropriate headers for the response
    // res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"'); // Change filename as needed
    // res.setHeader('Content-Type', 'video/mp4');

    // Stream the video to the response
    // ytdl(videoUrl, { quality: 'highestvideo' }).pipe(res).on('error', (error) => {
    //     console.error('Error downloading video:', error);
    //     res.status(500).send('Error downloading video');
    // });

    ytdl.getInfo(videoUrl).then(info => {
        let thumbnails = info.videoDetails.thumbnails;
        let thumbnail = thumbnails.reduce((max, obj) => (obj.height > max.height ? obj : max), thumbnails[0]);
        let mediaFiles = info.formats;

        let audioObjects = mediaFiles
            .filter(obj => obj.hasAudio && !obj.hasVideo)
            .map(obj => ({
                            mimeType: obj.mimeType,
                            audioBitrate: obj.audioBitrate,
                            link: obj.url
                        }));
        res.json({
            title:info.videoDetails.title,
            duration: parseFloat((info.videoDetails.lengthSeconds / 60).toFixed(2)),
            thumbnail: thumbnail.url,
            available_media: audioObjects,
        })
      });
});

app.get('/download',  async (req, res) => {
    const videoUrl = req.body.url; // Get the video URL from the query parameters
    const desiredQuality = req.body.quality;

    if (!videoUrl) {
        return res.status(400).send('Video URL is required');
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const audioFormat = ytdl.filterFormats(info.formats, 'audioonly').find(format => format.audioBitrate === desiredQuality);
    
        if (!audioFormat) {
          return res.status(404).send('Desired audio quality not found');
        }
    
        res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
        ytdl(videoUrl, { format: audioFormat }).pipe(res);
      } catch (error) {
        console.error('Error downloading the audio:', error);
        res.status(500).send('Internal Server Error');
      }

});





app.listen(port, () => {
    console.log(`server is started on port ${port}`)
})