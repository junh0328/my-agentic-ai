import React from "react";
import { ReviewAnalyzer } from "./components/ReviewAnalyzer";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 font-sans">
      <main className="container mx-auto py-6 px-4 md:py-12">
        <ReviewAnalyzer />
      </main>
    </div>
  );
}
