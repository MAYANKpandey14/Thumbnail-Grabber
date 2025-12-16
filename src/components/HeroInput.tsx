"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Download, Eye, Layers, CloudUpload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { extractVideoId } from "@/utils/extractVideoId";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { parseCsvFile } from "@/lib/csv/parseCsv";
import { toast } from "sonner";

interface HeroInputProps {
  onSearch: (urls: string[], previewOnly: boolean) => void;
  isLoading: boolean;
}

export default function HeroInput({ onSearch, isLoading }: HeroInputProps) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e: React.FormEvent, previewOnly: boolean) => {
    e.preventDefault();
    if (!input.trim()) return;

    let urls: string[] = [];

    if (isBulk) {
      // Split by newline, comma, or space
      urls = input
        .split(/[\n, ]+/)
        .map(u => u.trim())
        .filter(u => u.length > 0 && extractVideoId(u) !== null); // Basic validation
    } else {
      if (extractVideoId(input)) {
        urls = [input.trim()];
      }
    }

    if (urls.length > 0) {
      onSearch(urls, previewOnly);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv") || file.type === "application/vnd.ms-excel") {
      try {
        toast.info("Parsing CSV...");
        const result = await parseCsvFile(file);

        if (result.validCount > 0) {
          const urls = result.rows
            .filter(r => r.status === 'valid' && r.videoId)
            .map(r => `https://www.youtube.com/watch?v=${r.videoId}`);

          setInput(prev => {
            const existing = prev ? prev + '\n' : '';
            return existing + urls.join('\n');
          });
          toast.success(`Added ${result.validCount} URLs from CSV`);
        } else {
          toast.warning("No valid YouTube URLs found in CSV");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse CSV file");
      }
    } else {
      toast.error("Please select a valid .csv file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBulk && user) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isBulk || !user) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Shared animation variants for DRY principle
  const fadeInAnimation = {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
      >
        Download <span className="text-primary">YouTube</span> Thumbnails
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
      >
        Get high-quality thumbnails in FHD. Fast, free, and secure.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center mb-4"
      >
        <div className="bg-muted p-1 rounded-lg inline-flex">
          <Button
            variant={!isBulk ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsBulk(false)}
            className="text-xs"
          >
            Single Video
          </Button>
          <Button
            variant={isBulk ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsBulk(true)}
            className="text-xs gap-2"
          >
            <Layers className="w-3 h-3" />
            Bulk Mode
          </Button>
        </div>
      </motion.div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,application/vnd.ms-excel"
        className="hidden"
      />

      <motion.div
        layout
        transition={{ layout: { duration: 0.3, type: "spring", bounce: 0 } }}
        className={cn(
          "relative flex flex-col gap-2 p-2 rounded-xl border bg-background shadow-lg transition-shadow duration-300",
          isFocused ? "ring-2 ring-primary border-primary" : "",
          isDragging ? "ring-2 ring-primary border-primary bg-primary/5" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative flex-1 text-left">
          <AnimatePresence mode="wait">
            {isBulk ? (
              <motion.div
                key="bulk-mode"
                {...fadeInAnimation}
                className="w-full"
              >
                {!user ? (
                  <div className="h-[200px] flex flex-col items-center justify-center space-y-3 p-4 bg-muted/30 rounded-xl border-2 border-dashed text-center transition-colors hover:bg-muted/50">
                    <div className="text-sm font-medium text-muted-foreground">
                      Bulk Mode is available for logged-in users only.
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" asChild className="rounded-full px-6">
                        <Link to="/auth/login">Login</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="rounded-full px-6">
                        <Link to="/auth/signup">Sign Up</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col gap-4 p-2">
                    {/* Text Input styled like Single Mode */}
                    <div className="relative flex items-start">
                      <div className="absolute left-3 top-3 text-muted-foreground">
                        <Search className="h-5 w-5" />
                      </div>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Paste YouTube URLs ( one per line ), Upload or Drag and Drop .csv file"
                        className="min-h-[80px] w-full text-base border-none shadow-none focus-visible:ring-0 resize-none p-3 pl-10 bg-muted/10 rounded-lg placeholder:text-muted-foreground/60 focus:bg-muted/20 transition-colors"
                        disabled={isLoading}
                      />
                    </div>

                    {/* CSV Dropzone - Reference Style */}
                    <div
                      onClick={handleFileClick}
                      className={cn(
                        "group cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5",
                        isDragging && "border-primary bg-primary/10"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center text-center gap-2">
                        <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                          <CloudUpload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground/80">
                            <span className="text-primary hover:underline">Click here</span> to upload your file or drag and drop.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported Format: .CSV (YouTube URLs)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="single-mode"
                {...fadeInAnimation}
                className="relative h-[60px] flex items-center"
              >
                <div className="absolute left-4 text-muted-foreground/50">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Paste YouTube URL here..."
                  className="pl-12 h-full text-lg border-none shadow-none focus-visible:ring-0 w-full bg-transparent placeholder:text-muted-foreground/50"
                  disabled={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {(!isBulk || user) && (
          <div className={cn("transition-all duration-300", isBulk ? "hidden" : "absolute right-2 top-1/2 -translate-y-1/2")}>
            <Button
              size={isBulk ? "default" : "lg"}
              className={cn(
                "font-semibold shadow-lg transition-all hover:scale-105 active:scale-95",
                isBulk ? "w-full mt-2 rounded-lg" : "rounded-full h-11 px-6"
              )}
              disabled={isLoading || !input}
              onClick={(e) => handleSubmit(e, false)}
            >
              {isBulk ? null : (
                <>
                  {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
                  Grab
                </>
              )}
            </Button>
          </div>
        )}

        {/* Bulk Grab Button at Bottom */}
        {isBulk && user && (
          <div className="px-2 pb-2">
            <Button
              size="lg"
              className="w-full font-semibold shadow-lg h-12 rounded-lg"
              disabled={isLoading || !input}
              onClick={(e) => handleSubmit(e, false)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Bulk Grab
                </>
              )}
            </Button>
          </div>
        )}

      </motion.div>
    </div>
  );
}