import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { VideoItem } from '../services/storage';
import './VideoPlayer.css';

const GOOGLE_DRIVE_VIDEOS: VideoItem[] = [
  {
    id: '1jPAvmDD8rWvNp5Xw2aqFYAEKn1nAWTCO',
    title: 'Video 1',
    url: 'https://drive.google.com/uc?export=download&id=1jPAvmDD8rWvNp5Xw2aqFYAEKn1nAWTCO'
  },
  {
    id: '1sWQ3E7ReZ-LGgYzSR6Uy2_3tAZRHQ76o',
    title: 'Video 2',
    url: 'https://drive.google.com/uc?export=download&id=1sWQ3E7ReZ-LGgYzSR6Uy2_3tAZRHQ76o'
  },
  {
    id: '1q6M0qyC1e5cjsjtiBIbm9Qzz4JA3VzDi',
    title: 'Video 3',
    url: 'https://drive.google.com/uc?export=download&id=1q6M0qyC1e5cjsjtiBIbm9Qzz4JA3VzDi'
  }
];

const GoogleDriveVideoPlayer: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentVideo = GOOGLE_DRIVE_VIDEOS[currentVideoIndex];

  const handleVideoEnd = () => {
    // Calculate next index with loop back to 0 if at the end
    const nextIndex = (currentVideoIndex + 1) % GOOGLE_DRIVE_VIDEOS.length;
    setCurrentVideoIndex(nextIndex);
    setPlayed(0);
    setIsPlaying(true); // Ensure the next video starts playing
  };

  // Reset play state when video changes
  useEffect(() => {
    setIsPlaying(true);
  }, [currentVideoIndex]);

  // Auto-hide controls after 3 seconds
  React.useEffect(() => {
    if (controlsVisible) {
      hideControlsTimeout.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [controlsVisible, currentVideoIndex]);

  // Preload the next video for smoother transitions
  const preloadNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % GOOGLE_DRIVE_VIDEOS.length;
    const nextVideo = GOOGLE_DRIVE_VIDEOS[nextIndex];
    if (nextVideo) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = nextVideo.url;
      link.as = 'video';
      document.head.appendChild(link);
      
      // Clean up
      return () => {
        document.head.removeChild(link);
      };
    }
  };

  // Preload next video when current video changes
  React.useEffect(() => {
    preloadNextVideo();
  }, [currentVideoIndex]);

  // Fullscreen API handlers
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        (containerRef.current as any).mozRequestFullScreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && muted) {
      setMuted(false);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const handleSeek = (e: React.MouseEvent<HTMLProgressElement>) => {
    if (!playerRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    playerRef.current.seekTo(pos, 'fraction');
    setPlayed(pos);
  };

  return (
    <div 
      className="video-player-container" 
      ref={containerRef}
      onMouseMove={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={currentVideo.url}
        playing={isPlaying}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onEnded={handleVideoEnd}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true
            }
          }
        }}
      />

      {/* Controls Overlay */}
      <div 
        className={`controls-overlay ${!controlsVisible ? 'hidden' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="progress-bar" onClick={handleSeek}>
          <progress value={played} max={1} />
        </div>
        
        <div className="controls">
          <div className="left-controls">
            <button onClick={handlePlayPause} className="control-button">
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <div className="volume-controls">
              <button onClick={toggleMute} className="control-button">
                {muted || volume === 0 ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            <div className="video-info">
              <span className="video-title">{currentVideo.title}</span>
              <span className="video-count">
                {currentVideoIndex + 1} / {GOOGLE_DRIVE_VIDEOS.length}
              </span>
            </div>
          </div>
          
          <div className="right-controls">
            <button onClick={toggleFullscreen} className="control-button">
              {isFullscreen ? '⤵️' : '⤴️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveVideoPlayer;
