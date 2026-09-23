import React from 'react';
import { Cloud } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Mausam 3D
            </span>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-white/30">
              Weather data provided by{' '}
              <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400/60 hover:text-blue-400 transition-colors">
                Open-Meteo
              </a>
            </p>
            <p className="text-xs text-white/20 mt-1">
              Built for India • Times shown in IST (Asia/Kolkata)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
