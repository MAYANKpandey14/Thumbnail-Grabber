"use client";

import { Thumbnail, ThumbnailResponse } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, Video, Eye, X, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import JSZip from "jszip";
import FileSaver from "file-saver";
import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Robust saveAs helper that handles different export formats from esm.sh
const saveFile = (data: Blob | string, filename: string) => {
  // @ts-ignore
  const saver = FileSaver.saveAs || FileSaver;
  if (typeof saver === 'function') {
    saver(data, filename);
  } else {
    console.error("FileSaver import failed", FileSaver);
    toast.error("Could not save file. Please try again.");
  }
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'default' | 'secondary';
}

function Badge({ children, variant, className, ...props }: BadgeProps) {
  const styles = variant === 'default' 
    ? "bg-primary text-primary-foreground hover:bg-primary/80" 
    : "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", styles, className)} {...props}>
      {children}
    </div>
  )
}

interface ThumbnailGridProps {
  results: ThumbnailResponse[];
  checkDownloadAllowed: () => boolean;
  onDownloadComplete: (blob: Blob, thumb: Thumbnail, videoId: string) => Promise<void>;
}

interface ThumbnailCardProps { 
  thumb: Thumbnail;
  videoId: string;
  checkDownloadAllowed: () => boolean;
  onDownloadComplete: (blob: Blob, thumb: Thumbnail, videoId: string) => Promise<void>;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ 
  thumb, 
  videoId, 
  checkDownloadAllowed, 
  onDownloadComplete 
}) => {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (!checkDownloadAllowed()) return;

    setStatus('downloading');
    setProgress(0);

    try {
      const response = await fetch(thumb.url);
      if (!response.ok) throw new Error('Network error');

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Stream not supported');

      const chunks = [];
      while(true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total > 0) {
          setProgress(Math.round((loaded / total) * 100));
        }
      }

      const blob = new Blob(chunks, { type: 'image/jpeg' });
      saveFile(blob, `yt-${videoId}-${thumb.quality}.jpg`);
      
      setStatus('success');
      
      // Notify parent for history/storage in background
      await onDownloadComplete(blob, thumb, videoId);
      
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      toast.error("Download failed");
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow relative border-muted-foreground/10">
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img 
            src={thumb.url} 
            alt={thumb.quality} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Progress Overlay */}
          <AnimatePresence>
            {status === 'downloading' && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/40 flex items-end z-10"
               >
                  <div className="h-1 bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
               </motion.div>
            )}
          </AnimatePresence>

          {/* Hover / Status Actions */}
          <div className={cn(
             "absolute inset-0 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 z-20",
             status !== 'idle' ? "bg-black/60 opacity-100" : "bg-black/60 opacity-0 group-hover:opacity-100"
          )}>
            {status === 'idle' && (
              <>
                <div className="flex gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                  <Button size="sm" variant="secondary" onClick={handleDownload} className="shadow-lg">
                      <Download className="w-4 h-4 mr-2" /> Save
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] max-h-[90vh] w-fit p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-hidden">
                       <DialogTitle className="sr-only">Preview {thumb.quality}</DialogTitle>
                       <div className="relative">
                          <img 
                            src={thumb.url} 
                            alt={`Preview ${thumb.quality}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                          />
                          <DialogClose className="absolute -top-4 -right-4 bg-white text-black rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </DialogClose>
                       </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                   <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/20 h-8 px-2 text-xs" asChild>
                      <a href={thumb.url} target="_blank" rel="noopener noreferrer">
                        Open Link <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                   </Button>
                </div>
              </>
            )}

            {status === 'downloading' && (
              <div className="flex flex-col items-center text-white font-medium animate-in fade-in zoom-in duration-300">
                 <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                 <span className="text-sm font-mono">{progress}%</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-green-400 font-medium animate-in fade-in zoom-in duration-300">
                 <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-2 backdrop-blur-md shadow-lg">
                   <Check className="w-6 h-6" />
                 </div>
                 <span className="text-white drop-shadow-md font-bold tracking-wide">SAVED</span>
              </div>
            )}
             
            {status === 'error' && (
               <div className="flex flex-col items-center text-red-400 font-medium animate-in fade-in zoom-in duration-300">
                 <AlertCircle className="w-10 h-10 mb-2" />
                 <span>Failed</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-2 right-2 flex gap-1 z-10">
             <span className="bg-black/70 text-white text-xs px-2 py-1 rounded font-mono backdrop-blur-md shadow-sm border border-white/10">
               {thumb.dimensions}
             </span>
          </div>
        </div>

        <CardContent className="p-4 flex justify-between items-center relative">
          {/* Progress bar at bottom of card content as well */}
          {status === 'downloading' && (
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-muted overflow-hidden">
               <motion.div 
                 className="h-full bg-primary" 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ ease: "easeOut" }}
               />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant={thumb.quality === 'maxres' ? 'default' : 'secondary'}>
              {thumb.quality.toUpperCase()}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono uppercase">JPG</span>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ThumbnailGrid({ results, checkDownloadAllowed, onDownloadComplete }: ThumbnailGridProps) {
  const [isZipping, setIsZipping] = useState(false);

  const downloadAllZip = async () => {
    // Basic bulk check - strictly we should check if they have enough credits for all
    // But for now, we'll just check if they are allowed to download at all
    if (!checkDownloadAllowed()) return;

    setIsZipping(true);
    const zip = new JSZip();
    
    try {
      const allPromises: Promise<void>[] = [];

      results.forEach((videoData) => {
        const folder = zip.folder(`video-${videoData.videoId}`);
        videoData.thumbnails.forEach((thumb) => {
          allPromises.push(
            fetch(thumb.url)
              .then(res => res.blob())
              .then(blob => {
                 folder?.file(`${thumb.quality}.jpg`, blob);
              })
              .catch(err => console.error(`Failed to fetch ${thumb.url}`, err))
          );
        });
      });

      await Promise.all(allPromises);
      const content = await zip.generateAsync({ type: "blob" });
      const fileName = results.length === 1 
        ? `thumbnails-${results[0].videoId}.zip` 
        : `bulk-thumbnails-${results.length}-videos.zip`;
        
      saveFile(content, fileName);
      toast.success("Downloaded all thumbnails as ZIP!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ZIP file");
    } finally {
      setIsZipping(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm sticky top-16 z-40 transition-all hover:shadow-md">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
             Results 
             <Badge variant="secondary">{results.length} Videos</Badge>
          </h2>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Found {results.reduce((acc, curr) => acc + curr.thumbnails.length, 0)} total thumbnails
          </p>
        </div>
        <Button onClick={downloadAllZip} disabled={isZipping} className="shadow-md">
          {isZipping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zipping...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download All (ZIP)
            </>
          )}
        </Button>
      </div>

      {results.map((videoData, index) => (
        <motion.div 
          key={videoData.videoId}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b">
             <Video className="w-5 h-5 text-primary" />
             <h3 className="font-semibold text-lg">Video ID: {videoData.videoId}</h3>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {videoData.thumbnails.map((thumb) => (
              <ThumbnailCard 
                key={`${videoData.videoId}-${thumb.quality}`}
                thumb={thumb}
                videoId={videoData.videoId}
                checkDownloadAllowed={checkDownloadAllowed}
                onDownloadComplete={onDownloadComplete}
              />
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}