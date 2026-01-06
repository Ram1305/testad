import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { VideoItem } from '../services/storage';
import './VideoPlayer.css';

interface VideoPlayerProps {
  video: VideoItem | null;
  loop: boolean;
  onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, loop, onVideoEnd }) => {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
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
  }, [controlsVisible]);

  // Fullscreen API handlers
  useEffect(() => {
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F key for fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Escape to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
      // Space for play/pause (only if not typing in input)
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
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
    showControls();
  };

  const showControls = () => {
    setControlsVisible(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    showControls();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    showControls();
  };

  const handleToggleMute = () => {
    setMuted(!muted);
    showControls();
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      playerRef.current.seekTo(pos);
      setPlayed(pos);
      showControls();
    }
  };

  if (!video) {
    return (
      <div className="video-player-empty">
        <div className="empty-message">
          <h2>No Video Selected</h2>
          <p>Select a video from the list to start playback</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`video-player-container ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={showControls}
      onMouseLeave={() => setControlsVisible(false)}
      onClick={handlePlayPause}
    >
      <ReactPlayer
        ref={playerRef}
        url={video.url}
        playing={playing}
        volume={volume}
        muted={muted}
        loop={loop}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onEnded={() => {
          if (!loop && onVideoEnd) {
            onVideoEnd();
          }
        }}
        config={{
          file: {
            attributes: {
              controls: false,
            },
          },
        }}
      />

      {/* Custom Controls */}
      {controlsVisible && (
        <div className="video-controls">
          <div className="progress-bar-container" onClick={handleSeek}>
            <div className="progress-bar" style={{ width: `${played * 100}%` }} />
          </div>

          <div className="controls-bottom">
            <button 
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? '⏸️' : '▶️'}
            </button>

            <div className="volume-control">
              <button
                className="control-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMute();
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  e.stopPropagation();
                  handleVolumeChange(e);
                }}
                className="volume-slider"
              />
            </div>

            <div className="video-info">
              <span className="video-title">{video.title}</span>
              <span className="loop-indicator">{loop ? '🔁 Loop Mode' : ''}</span>
            </div>

            <button
              className="control-btn fullscreen-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen (F or Esc)' : 'Enter Fullscreen (F)'}
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};