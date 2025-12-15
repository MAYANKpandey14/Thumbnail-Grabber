-- 1. HISTORY (User Downloads)
-- Use this simple table to track what users have fetched.
CREATE TABLE IF NOT EXISTS public.user_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    video_url TEXT NOT NULL,
    video_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for History
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own history"
    ON public.user_downloads
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- 2. FOLDERS
CREATE TABLE IF NOT EXISTS public.thumbnail_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for Folders
ALTER TABLE public.thumbnail_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own folders"
    ON public.thumbnail_folders
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- 3. FOLDER VIDEOS (Items inside folders)
CREATE TABLE IF NOT EXISTS public.folder_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID NOT NULL REFERENCES public.thumbnail_folders(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    video_url TEXT NOT NULL,
    video_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(folder_id, video_id)
);

-- RLS for Folder Videos
ALTER TABLE public.folder_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own folder videos"
    ON public.folder_videos
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- 4. Triggers (Optional but nice)
-- Update `updated_at` on folders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_thumbnail_folders_updated_at
    BEFORE UPDATE ON public.thumbnail_folders
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
