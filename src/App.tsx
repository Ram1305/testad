import { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { CloudinaryUpload } from './components/CloudinaryUpload';
import { StorageService, VideoItem } from './services/storage';
import { initCloudinary } from './config/cloudinary';
import './App.css';

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [loopMode, setLoopMode] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Initialize Cloudinary
    initCloudinary();
    loadVideos();

    // Add sample videos if none exist (for demo purposes)
    const existingVideos = StorageService.getVideos();
    if (existingVideos.length === 0) {
      // Add a sample video URL - replace with your actual video URL
      const sampleVideo: VideoItem = {
        id: 'sample-1',
        title: 'Sample Video (Replace with your video)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      };
      StorageService.addVideo(sampleVideo);
      setVideos([sampleVideo]);
      setSelectedVideo(sampleVideo);
    }
  }, []);

  const loadVideos = () => {
    const loadedVideos = StorageService.getVideos();
    setVideos(loadedVideos);
    if (loadedVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(loadedVideos[0]);
    }
  };

  const handleVideoUpload = (video: VideoItem) => {
    StorageService.addVideo(video);
    loadVideos();
    setSelectedVideo(video);
    setShowUpload(false);
  };


  const handleVideoEnd = () => {
    if (!loopMode && videos.length > 0) {
      const currentIndex = videos.findIndex(v => v.id === selectedVideo?.id);
      const nextIndex = (currentIndex + 1) % videos.length;
      setSelectedVideo(videos[nextIndex]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📺 Video Venkateswara TV Add-on</h1>
        <div className="header-controls">
          <button
            className={`control-toggle ${loopMode ? 'active' : ''}`}
            onClick={() => setLoopMode(!loopMode)}
            aria-label={`${loopMode ? 'Disable' : 'Enable'} loop mode`}
          >
            🔁 Loop Mode: {loopMode ? 'ON' : 'OFF'}
          </button>
          <button
            className="control-toggle"
            onClick={() => setShowUpload(!showUpload)}
            aria-label={showUpload ? 'Hide upload' : 'Show upload'}
          >
            {showUpload ? '✕ Close' : '☁️ Upload'}
          </button>
        </div>
      </header>

      <div className="app-content">
        <main className="video-main">
          {showUpload && (
            <div className="upload-overlay">
              <CloudinaryUpload onUploadComplete={handleVideoUpload} />
            </div>
          )}
          <VideoPlayer
            video={selectedVideo}
            loop={loopMode}
            onVideoEnd={handleVideoEnd}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
