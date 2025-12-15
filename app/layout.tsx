import React from "react";
import { Toaster } from "sonner";

// Metadata is not used in client-side runtime directly but kept for structure
export const metadata = {
  title: "YT Thumb Grabber Pro",
  description: "Download High Quality YouTube Thumbnails",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans antialiased">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}