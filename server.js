import express from "express";
import cors from "cors";
import "dotenv/config";

import audioRouter from "./routes/route.audio.js"

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

//routes
app.use('/audio',audioRouter)

app.get("/download", async (req, res) => {
  const videoUrl = req.body.url; // Get the video URL from the query parameters
  const desiredQuality = req.body.quality;

  if (!videoUrl) {
    return res.status(400).send("Video URL is required");
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl
      .filterFormats(info.formats, "audioonly")
      .find((format) => format.audioBitrate === desiredQuality);
    const title = info.videoDetails.title;
    if (!audioFormat) {
      return res.status(404).send("Desired audio quality not found");
    }

    res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"');
    ytdl(videoUrl, { format: audioFormat }).pipe(res);
  } catch (error) {
    console.error("Error downloading the audio:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`server is started on port ${port}`);
});
