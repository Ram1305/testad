import { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { CloudinaryUpload } from './components/CloudinaryUpload';
import GoogleDriveVideoPlayer from './components/GoogleDriveVideoPlayer';
import { StorageService, VideoItem } from './services/storage';
import { initCloudinary } from './config/cloudinary';
import './App.css';

type ViewMode = 'cloudinary' | 'google-drive';

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [loopMode, setLoopMode] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cloudinary');

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

  const renderContent = () => {
    if (viewMode === 'google-drive') {
      return <GoogleDriveVideoPlayer />;
    }

    if (showUpload) {
      return (
        <div className="upload-container">
          <CloudinaryUpload onUploadComplete={handleVideoUpload} />
        </div>
      );
    }

    return (
      <div className="player-container">
        <VideoPlayer 
          video={selectedVideo} 
          loop={loopMode} 
          onVideoEnd={handleVideoEnd} 
        />
        <div className="video-list">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className={`video-thumbnail ${selectedVideo?.id === video.id ? 'active' : ''}`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="thumbnail-overlay">
                <span>{video.title}</span>
              </div>
              <img 
                src={video.thumbnail || 'https://via.placeholder.com/160x90?text=No+Thumbnail'} 
                alt={video.title} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TV Video Player</h1>
        <div className="controls">
          <div className="view-tabs">
            <button
              className={`tab-button ${viewMode === 'cloudinary' ? 'active' : ''}`}
              onClick={() => setViewMode('cloudinary')}
            >
              Cloudinary Videos
            </button>
            <button
              className={`tab-button ${viewMode === 'google-drive' ? 'active' : ''}`}
              onClick={() => setViewMode('google-drive')}
            >
              Google Drive Videos
            </button>
          </div>
          
          {viewMode === 'cloudinary' && (
            <>
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className="upload-button"
              >
                {showUpload ? 'Back to Player' : 'Upload Video'}
              </button>
              <div className="loop-control">
                <label>
                  <input
                    type="checkbox"
                    checked={loopMode}
                    onChange={(e) => setLoopMode(e.target.checked)}
                  />
                  Loop Mode
                </label>
              </div>
            </>
          )}
        </div>
      </header>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
