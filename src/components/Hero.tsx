import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToBeats = () => {
    const beatsSection = document.querySelector('#beats-section');
    beatsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cyberpunk Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        {/* Scanlines Effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJzY2FubGluZXMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc2NhbmxpbmVzKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Glitch Text Effect */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 animate-pulse hero-gradient relative
          before:content-['Rudy_Btz'] before:absolute before:inset-0 before:text-red-500 before:animate-glitch-1
          after:content-['Rudy_Btz'] after:absolute after:inset-0 after:text-blue-500 after:animate-glitch-2">
          Rudy Btz
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
          Rapper, Music Producer, and Beatmaker
        </p>

        <Button 
          onClick={scrollToBeats}
          className="neon-button group text-lg"
        >
          Explore Beats
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none"></div>
    </div>
  );
};

export default Hero;