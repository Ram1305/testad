# 📺 Video Venkateswara TV Add-on

A modern React + TypeScript TV add-on with Cloudinary integration, featuring video loop mode playback optimized for Smart TVs.

## Features

- ✅ **Video Loop Mode** - Continuous playback with loop functionality
- ✅ **Cloudinary Integration** - Upload and manage videos via Cloudinary
- ✅ **TV-Optimized UI** - Designed for Smart TV remote navigation
- ✅ **Video Library** - Manage and organize your video collection
- ✅ **Responsive Design** - Works on various screen sizes
- ✅ **BigRock Ready** - Optimized for static hosting deployment

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tool
- **React Player** - Video playback with loop support
- **Cloudinary React SDK** - Media management
- **LocalStorage** - Data storage (easily swappable with Firebase/Supabase)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Cloudinary account (free tier available)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Cloudinary:**
   - Copy `.env.example` to `.env`
   - Get your Cloudinary credentials from [Cloudinary Dashboard](https://cloudinary.com/console)
   - Update `.env` with your credentials:
     ```
     VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
     VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
     VITE_CLOUDINARY_API_KEY=your-api-key
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Development server runs on `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to BigRock or any static hosting.

## Deployment to BigRock

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to BigRock:**
   - Upload all files from the `dist` folder to your BigRock hosting
   - Ensure the `index.html` is in the root directory

3. **Environment Variables:**
   - For production, set environment variables in your BigRock hosting panel
   - Or build with variables embedded (update `vite.config.ts` if needed)

## Project Structure

```
videovenkateswara/
├── src/
│   ├── components/          # React components
│   │   ├── VideoPlayer.tsx  # Video player with loop mode
│   │   ├── VideoList.tsx    # Video library list
│   │   └── CloudinaryUpload.tsx # Cloudinary upload widget
│   ├── services/
│   │   └── storage.ts       # Data storage service
│   ├── config/
│   │   └── cloudinary.ts    # Cloudinary configuration
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── index.html
├── vite.config.ts
└── package.json
```

## Usage

### Adding Videos

1. Click the **"☁️ Upload"** button
2. Use Cloudinary upload widget to select/upload videos
3. Videos are automatically added to your library

### Playing Videos

- Click on any video in the library to start playback
- Use controls to play/pause, adjust volume
- Toggle loop mode on/off in the header

### Loop Mode

- **ON**: Video repeats continuously
- **OFF**: Video plays once, then moves to next video in queue

## TV Remote Navigation

The app is optimized for TV remote controls:
- **Arrow keys** - Navigate between videos
- **Enter/Space** - Select video
- **Delete/Backspace** - Delete selected video

## Data Storage

Currently uses **LocalStorage** for simplicity. To switch to Firebase/Supabase:

1. Uncomment the Firebase example in `src/services/storage.ts`
2. Install Firebase SDK: `npm install firebase`
3. Update the storage service with your Firebase config

## Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name from the dashboard
3. Create an upload preset:
   - Go to Settings → Upload
   - Create a new unsigned upload preset
   - Set resource type to "Video"
   - Enable "Eager transformations" if needed

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Smart TV browsers (Samsung Tizen, LG webOS, Android TV)

## License

MIT

## Support

For issues or questions, please check the configuration and ensure Cloudinary credentials are correct.

