import React from "react";
import { Toaster } from "sonner";

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