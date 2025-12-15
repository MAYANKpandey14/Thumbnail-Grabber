import React from "react";
import { createRoot } from "react-dom/client";
import { Route, Switch, Router } from "wouter";
import RootLayout from "./app/layout";
import Home from "./app/page";
import Login from "./app/(auth)/login/page";
import Signup from "./app/(auth)/signup/page";
import Dashboard from "./app/(app)/dashboard/page";
import { Toaster } from "sonner";

const App = () => {
  return (
    <RootLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
        <Route>
          <div className="flex items-center justify-center min-h-screen">
             <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p>Page not found</p>
             </div>
          </div>
        </Route>
      </Switch>
    </RootLayout>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}