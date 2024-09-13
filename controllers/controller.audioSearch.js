import ytdl from "@distube/ytdl-core";

const searchSong = async (req,res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
      return res.status(400).json({
        success:false,
        message:"URL is required"
    });
    }
  
    try {
      const info = await ytdl.getInfo(videoUrl);
  
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  
      const thumbnail = info.videoDetails.thumbnails.reduce(
        (max, obj) => (obj.height > max.height ? obj : max),
        info.videoDetails.thumbnails[0]
      );
  
      const title = info.videoDetails.title;
      const duration = parseFloat((info.videoDetails.lengthSeconds / 60).toFixed(2));
  
  
      const uniqueAudioFormats = new Map();
      audioFormats.forEach((format) => {
        if (
          !uniqueAudioFormats.has(format.audioBitrate) ||
          uniqueAudioFormats.get(format.audioBitrate).audioQuality <
            format.audioQuality
        ) {
          uniqueAudioFormats.set(format.audioBitrate, {
            mimeType: format.mimeType,
            audioBitrate: format.audioBitrate,
            qualityLabel: format.qualityLabel,
            url: format.url,
            audioQuality: format.audioQuality,
          });
        }
      });
  
      const audioDetails = Array.from(uniqueAudioFormats.values());
  
      res.status(200).json({
        success: true,
        data:{
            title,
            thumbnail:thumbnail.url,
            duration,
            available_media:audioDetails
        }
});
    } catch (error) {
      res.status(500).json({
        success:false,
        message: "Internal Server Error"
    });
    }
}

export default searchSong;