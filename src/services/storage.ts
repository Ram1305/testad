// Data storage service - can be easily swapped with Firebase/Supabase
export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  cloudinaryId?: string;
}

export class StorageService {
  private static STORAGE_KEY = 'tv_addon_videos';

  // Get all videos
  static getVideos(): VideoItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading videos:', error);
      return [];
    }
  }

  // Add a video
  static addVideo(video: VideoItem): void {
    const videos = this.getVideos();
    videos.push(video);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
  }

  // Update a video
  static updateVideo(id: string, updates: Partial<VideoItem>): void {
    const videos = this.getVideos();
    const index = videos.findIndex(v => v.id === id);
    if (index !== -1) {
      videos[index] = { ...videos[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
    }
  }

  // Delete a video
  static deleteVideo(id: string): void {
    const videos = this.getVideos();
    const filtered = videos.filter(v => v.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  // Get a video by ID
  static getVideoById(id: string): VideoItem | undefined {
    const videos = this.getVideos();
    return videos.find(v => v.id === id);
  }

  // Clear all videos
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Firebase/Supabase integration example (commented out)
/*
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class FirebaseStorageService {
  private static collectionName = 'videos';

  static async getVideos(): Promise<VideoItem[]> {
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
  }

  static async addVideo(video: Omit<VideoItem, 'id'>): Promise<void> {
    await addDoc(collection(db, this.collectionName), video);
  }

  // ... other methods
}
*/

