import ytdl from "@distube/ytdl-core";

const searchVideo = async (req,res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
      return res.status(400).json({
        success:false,
        message:"URL is required"
    });
    }
  
    try {
        const info = await ytdl.getInfo(videoUrl);
        const videoFormats = ytdl.filterFormats(info.formats, format => format.hasVideo && format.hasAudio);
    
        const thumbnail = info.videoDetails.thumbnails.reduce(
            (max, obj) => (obj.height > max.height ? obj : max),
            info.videoDetails.thumbnails[0]
          );
      
          const title = info.videoDetails.title;
          
          const duration = parseFloat((info.videoDetails.lengthSeconds / 60).toFixed(2));

        const uniqueVideoFormats = new Map();
        videoFormats.forEach(format => {
          if (!uniqueVideoFormats.has(format.qualityLabel) || uniqueVideoFormats.get(format.qualityLabel).bitrate < format.bitrate) {
            uniqueVideoFormats.set(format.qualityLabel, {
              mimeType: format.mimeType,
              qualityLabel: format.qualityLabel,
              height: format.height,
              width: format.width,
              url: format.url
            });
          }
        });
    
        const videoDetails = Array.from(uniqueVideoFormats.values());
    
      res.status(200).json({
        success: true,
        data:{
            title,
            thumbnail:thumbnail.url,
            duration,
            available_media:videoDetails
        }
});
    } catch (error) {
      res.status(500).json({
        success:false,
        message: "Internal Server Error"
    });
    }
}

export default searchVideo;