import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Pause } from "lucide-react";

interface LandingHeroProps {
  activeTab: string;
  navigationTabs: string[];
  onTabChange: (tab: string) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export function LandingHero({ activeTab, navigationTabs, onTabChange, isAutoPlaying, onToggleAutoPlay }: LandingHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-500/20 text-blue-100 border-blue-400/30">
            🎓 Transforming Education in Kenya
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Complete Educational
            <br />
            <span className="text-blue-200">Technology Platform</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            An integrated suite of educational tools designed specifically for the Kenyan education system. 
            From school management to digital learning, family engagement to advanced analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-blue-300 text-blue-100 hover:bg-blue-500/20 px-8 py-3 text-lg">
                Watch Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
            <span>📊 Used by 500+ schools</span>
            <span>•</span>
            <span>🏫 Supporting 50,000+ students</span>
            <span>•</span>
            <span>🇰🇪 Built for Kenya</span>
          </div>
        </div>

        {/* Interactive Module Navigator */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Explore Our Platform</h2>
            <button
              onClick={onToggleAutoPlay}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlaying ? 'Pause' : 'Play'} Auto-tour
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {navigationTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <div className="font-semibold text-sm">{tab}</div>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <div className={`inline-block px-6 py-3 bg-blue-500/30 rounded-full text-sm transition-all duration-500 ${
              activeTab ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            }`}>
              Currently viewing: <span className="font-semibold">{activeTab}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}