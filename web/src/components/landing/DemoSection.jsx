import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // Intersection Observer to auto-play when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
        
        // Auto-play when 50% of the section is visible
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          if (videoRef.current && !isPlaying) {
            handlePlay();
          }
        }
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: "-50px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-orange-900 mb-6">
            See FleetHQ in Action
          </h2>
          <p className="text-xl text-orange-700 max-w-3xl mx-auto leading-relaxed">
            Watch how enterprises worldwide are transforming their operations with 
            intelligent drone fleet management and autonomous mission planning.
          </p>
        </div>

        {/* Demo Video Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Video Wrapper with Enhanced Styling */}
          <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-200 transition-all duration-500 ${isInView ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`}>
            {/* Video Element - Placeholder for now */}
            <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-orange-200">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                muted
                playsInline
              >
                {/* Video source will be added later */}
                <source src="" type="video/mp4" />
              </video>

              {/* Placeholder Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100/90 to-orange-200/90">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="h-10 w-10 text-orange-500 ml-1" />
                  </div>
                  <h3 className="text-2xl font-semibold text-orange-900">Demo Video</h3>
                  <p className="text-orange-700">Video will be added here</p>
                </div>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 group">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={togglePlayPause}
                      className="bg-white/90 hover:bg-white text-orange-900 border-0"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRestart}
                      className="bg-white/90 hover:bg-white text-orange-900 border-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                    FleetHQ Demo
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-0 border-4 border-orange-300/50 rounded-2xl pointer-events-none"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>

          {/* Background Decoration */}
          <div className="absolute -inset-8 bg-gradient-to-r from-orange-100/30 to-orange-200/30 rounded-3xl transform rotate-1 -z-10"></div>
          <div className="absolute -inset-6 bg-gradient-to-l from-orange-50/50 to-orange-100/50 rounded-3xl transform -rotate-1 -z-20"></div>
        </div>
      </div>
    </section>
  );
}
