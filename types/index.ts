export type ThumbnailQuality = 'maxres' | 'hq' | 'mq' | 'sd' | 'default';

export interface Thumbnail {
  quality: ThumbnailQuality;
  url: string;
  dimensions: string;
  width?: number;
  height?: number;
}

export interface ThumbnailResponse {
  videoId: string;
  thumbnails: Thumbnail[];
  total: number;
}

export interface UserDownload {
  id: string;
  user_id: string;
  video_id: string;
  video_url: string;
  video_title: string;
  thumbnails: Thumbnail[];
  created_at: string;
}

export interface SavedThumbnail {
  id: string;
  user_id: string;
  download_id: string;
  quality: string;
  image_url: string;
  file_path: string;
  dimensions: string;
  created_at: string;
}
