// Initialize Cloudinary with your cloud name
const cld = cloudinary.Cloudinary.new({ cloud_name: 'dktrfzabz' });

// Initialize the video player
const player = cld.videoPlayer('video-player', {
    autoplay: true,
    controls: true,
    loop: true,
    muted: true, // Required for autoplay in most browsers
    transformation: { quality: 'auto' },
    sourceTypes: ['mp4']
});

// Load the video
player.source('Velacherry_Testimonial_qhyk6m');

// Handle any errors
player.on('error', function(errorEvent) {
    console.error('Video player error:', errorEvent);
});

// Log when the video starts playing
player.on('play', function() {
    console.log('Video started playing');
    const statusElement = document.getElementById('loop-status');
    if (statusElement) {
        statusElement.textContent = 'Now Playing';
    }
});

// Handle video end and restart
player.on('ended', function() {
    console.log('Video ended, restarting...');
    player.currentTime(0);
    player.play();
});

// Fullscreen button functionality
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const playerElement = document.getElementById('video-player');
            if (!document.fullscreenElement) {
                if (playerElement.requestFullscreen) {
                    playerElement.requestFullscreen();
                } else if (playerElement.mozRequestFullScreen) { // Firefox
                    playerElement.mozRequestFullScreen();
                } else if (playerElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    playerElement.webkitRequestFullscreen();
                } else if (playerElement.msRequestFullscreen) { // IE/Edge
                    playerElement.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
            }
        });
    }
});

// Function to play the next video in the playlist
function playNextVideo() {
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    console.log('Switching to next video:', nextIndex + 1);
    playVideo(nextIndex);
}

// Initialize the player
function initPlayer() {
    console.log('Initializing video player...');
    
    if (!videoPlayer) {
        console.error('Video player element not found!');
        return;
    }
    
    // Set up event listeners
    videoPlayer.addEventListener('ended', playNextVideo);
    
    // Handle errors
    videoPlayer.addEventListener('error', (e) => {
        console.error('Video error:', e);
        if (loopStatus) {
            loopStatus.textContent = 'Error loading video. Trying next...';
        }
        // Try playing next video if current one fails
        setTimeout(playNextVideo, 2000);
    });
    
    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) {
                videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) {
                videoPlayer.msRequestFullscreen();
            }
        });
    }
    
    // Start playing the first video
    playVideo(0);
}

// Initialize the player when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
} else {
    // In case the document is already loaded
    setTimeout(initPlayer, 500);
}

// Add some basic styling for the video player
const style = document.createElement('style');
style.textContent = `
    #video-player {
        width: 100%;
        height: 100%;
        background: #000;
        outline: none;
    }
    .video-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        overflow: hidden;
    }
    .video-wrapper video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(style);

console.log("Video player script loaded. Initializing player...");
