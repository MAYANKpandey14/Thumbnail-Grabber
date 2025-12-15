-- Create thumbnail_folders table
CREATE TABLE IF NOT EXISTS public.thumbnail_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create folder_videos table
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

-- Enable Row Level Security
ALTER TABLE public.thumbnail_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folder_videos ENABLE ROW LEVEL SECURITY;

-- Policies for thumbnail_folders
CREATE POLICY "Users can view their own folders"
    ON public.thumbnail_folders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders"
    ON public.thumbnail_folders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
    ON public.thumbnail_folders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
    ON public.thumbnail_folders FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for folder_videos
CREATE POLICY "Users can view their own folder videos"
    ON public.folder_videos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add videos to their folders"
    ON public.folder_videos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their folder videos"
    ON public.folder_videos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete videos from their folders"
    ON public.folder_videos FOR DELETE
    USING (auth.uid() = user_id);

-- Triggers for updated_at
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
