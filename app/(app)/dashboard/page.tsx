"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDownload, SavedThumbnail } from "@/types";
import { ExternalLink, Calendar, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [history, setHistory] = useState<UserDownload[]>([]);
  const [saved, setSaved] = useState<SavedThumbnail[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: historyData } = await supabase
        .from('user_downloads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (historyData) setHistory(historyData);

      const { data: savedData } = await supabase
        .from('saved_thumbnails')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (savedData) setSaved(savedData);
    };

    fetchData();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Download History</TabsTrigger>
            <TabsTrigger value="saved">My Saved Thumbnails</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <div className="grid gap-4">
              {history.length === 0 && <p className="text-muted-foreground">No history found.</p>}
              {history.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <div className="flex flex-col">
                      <CardTitle className="text-base">{item.video_title || item.video_id}</CardTitle>
                      <span className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(item.created_at), 'PPP p')}
                      </span>
                    </div>
                    <a href={item.video_url} target="_blank" className="text-primary hover:underline flex items-center text-sm">
                      Watch Video <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {saved.length === 0 && <p className="text-muted-foreground col-span-full">No saved thumbnails.</p>}
                {saved.map((item) => (
                   <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        <img src={item.image_url} alt="Saved" className="object-cover w-full h-full" />
                      </div>
                      <CardContent className="p-3">
                         <div className="flex justify-between items-center text-xs">
                            <span className="font-bold uppercase">{item.quality}</span>
                            <span className="text-muted-foreground">{item.dimensions}</span>
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}