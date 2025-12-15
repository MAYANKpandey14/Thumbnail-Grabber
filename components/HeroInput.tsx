"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Download, Eye, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { extractVideoId } from "@/lib/utils";

interface HeroInputProps {
  onSearch: (urls: string[], previewOnly: boolean) => void;
  isLoading: boolean;
}

export default function HeroInput({ onSearch, isLoading }: HeroInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isBulk, setIsBulk] = useState(false);

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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
      >
        Download <span className="text-primary">YouTube</span> Thumbnails
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
      >
        Get high-quality thumbnails in 4K, HD, and more. Fast, free, and secure.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "relative flex flex-col gap-2 p-2 rounded-xl border bg-background shadow-lg transition-all duration-300",
          isFocused ? "ring-2 ring-primary border-primary" : ""
        )}
      >
        <div className="relative flex-1 text-left">
          {isBulk ? (
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Paste multiple YouTube URLs here (one per line)..."
              className="min-h-[120px] text-base border-none shadow-none focus-visible:ring-0 resize-none p-3"
              disabled={isLoading}
            />
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Paste YouTube URL here..."
                className="pl-10 h-12 text-lg border-none shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <div className={cn("flex gap-2", isBulk ? "justify-end px-2 pb-2" : "")}>
           <Button 
            size="lg" 
            className="h-12 px-6 font-semibold"
            disabled={isLoading || !input}
            onClick={(e) => handleSubmit(e, false)}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-4 w-4" />}
            {isBulk ? "Process All" : "Download All"}
          </Button>
           <Button 
            variant="secondary"
            size="lg" 
            className="h-12 px-4"
            disabled={isLoading || !input}
            onClick={(e) => handleSubmit(e, true)}
            title="Preview Only"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}