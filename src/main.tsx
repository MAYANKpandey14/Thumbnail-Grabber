import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import App from './App';
// Import globals css from root (since we are in src/)
// The existing project has globals.css in root.
import "../globals.css";

import { ThemeProvider } from "./components/theme-provider";

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <ThemeProvider defaultTheme="light" disableTransitionOnChange>
                    <BrowserRouter>
                        <App />
                        <Toaster position="top-center" richColors />
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </React.StrictMode>
    );
}
