import React from 'react';
import { VideoItem } from '../services/storage';
import './VideoList.css';

interface VideoListProps {
  videos: VideoItem[];
  selectedVideo: VideoItem | null;
  onSelectVideo: (video: VideoItem) => void;
  onDeleteVideo: (id: string) => void;
}

export const VideoList: React.FC<VideoListProps> = ({
  videos,
  selectedVideo,
  onSelectVideo,
  onDeleteVideo,
}) => {
  if (videos.length === 0) {
    return (
      <div className="video-list-empty">
        <p>No videos available</p>
        <p className="hint">Add videos using Cloudinary upload</p>
      </div>
    );
  }

  return (
    <div className="video-list">
      <h2 className="video-list-title">Video Library</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`video-card ${selectedVideo?.id === video.id ? 'selected' : ''}`}
            onClick={() => onSelectVideo(video)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectVideo(video);
              }
              if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                onDeleteVideo(video.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Select video: ${video.title}`}
          >
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
            ) : (
              <div className="video-thumbnail-placeholder">
                <span>🎬</span>
              </div>
            )}
            <div className="video-card-info">
              <h3 className="video-card-title">{video.title}</h3>
              {video.duration && (
                <span className="video-duration">{formatDuration(video.duration)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

