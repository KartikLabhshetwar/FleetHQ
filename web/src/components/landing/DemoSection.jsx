import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // Calculate scroll progress for zoom effect
        const progress = Math.min(entry.intersectionRatio * 1.5, 1);
        setScrollProgress(progress);
        
        // Auto-play when 50% of the section is visible and video is ready
        if (entry.isIntersecting && entry.intersectionRatio > 0.5 && videoReady && !hasVideoError) {
          if (videoRef.current && !isPlaying) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                })
                .catch((error) => {
                  console.error("Auto-play failed:", error);
                  // Auto-play failed, but don't set error state as user can still manually play
                });
            }
          }
        }
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05), // More granular thresholds
        rootMargin: "-10px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying, videoReady, hasVideoError]);

  // Additional scroll listener for smooth animations
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, -rect.top);
        const visibleBottom = Math.min(rect.height, windowHeight - rect.top);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const progress = visibleHeight / rect.height;
        
        setScrollProgress(Math.min(progress * 1.2, 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRestart = () => {
    if (videoRef.current && videoReady && !hasVideoError) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error restarting video:", error);
            setHasVideoError(true);  
          });
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className="text-center mb-16 transform transition-all duration-1000 ease-out"
          style={{
            opacity: scrollProgress,
            transform: `translateY(${(1 - scrollProgress) * 50}px)`
          }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-orange-900 mb-6">
            See FleetHQ in Action
          </h2>
          <p className="text-xl text-orange-700 max-w-3xl mx-auto leading-relaxed">
            Watch how enterprises worldwide are transforming their operations with 
            intelligent drone fleet management and autonomous mission planning.
          </p>
        </div>

        {/* Demo Video Container */}
        <div 
          className="relative max-w-5xl mx-auto"
          style={{
            transform: `scale(${0.7 + (scrollProgress * 0.3)}) translateY(${(1 - scrollProgress) * 100}px)`,
            opacity: Math.max(0.3, scrollProgress),
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
          }}
        >
          {/* Video Wrapper with Enhanced Styling */}
          <div 
            className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-200 transition-all duration-700 ease-out`}
            style={{
              transform: `rotateX(${(1 - scrollProgress) * 15}deg) rotateY(${(1 - scrollProgress) * -5}deg)`,
              boxShadow: `0 ${20 + (scrollProgress * 30)}px ${60 + (scrollProgress * 40)}px rgba(251, 146, 60, ${0.1 + (scrollProgress * 0.2)})`
            }}
          >
            {/* Video Element - With fallback placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-orange-200">
              {!hasVideoError ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onLoadedData={() => setVideoReady(true)}
                  onError={() => {
                    setHasVideoError(true);
                    setVideoReady(false);
                  }}
                  onCanPlay={() => setVideoReady(true)}
                  muted
                  playsInline
                  preload="metadata"
                >
                  {/* Try multiple video sources */}
                  <source src="/demo-fleethq.mp4" type="video/mp4" />
                  <source src="/videos/demo-fleethq.mp4" type="video/mp4" />
                  {/* Fallback for browsers that don't support video */}
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Fallback content when video fails to load */
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-orange-300 rounded-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-orange-900 mb-2">
                      Demo Video Coming Soon
                    </h3>
                    <p className="text-orange-700">
                      We're preparing an amazing demo video to showcase FleetHQ's capabilities.
                    </p>
                  </div>
                </div>
              )}

              {/* Video Controls Overlay - Only show if video is ready */}
              {!hasVideoError && videoReady && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 group">
                  <div 
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-2"
                  >
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRestart}
                        className="bg-white/90 hover:bg-white text-orange-900 border-0 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        disabled={!videoReady || hasVideoError}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-white text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      FleetHQ Demo
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-0 border-4 border-orange-300/50 rounded-2xl pointer-events-none"></div>
          </div>

          {/* Background Decoration */}
          <div 
            className="absolute -inset-8 bg-gradient-to-r from-orange-100/30 to-orange-200/30 rounded-3xl -z-10 transition-all duration-700 ease-out"
            style={{
              transform: `rotate(${1 + (scrollProgress * 2)}deg) scale(${0.8 + (scrollProgress * 0.2)})`,
              opacity: 0.3 + (scrollProgress * 0.4)
            }}
          ></div>
          <div 
            className="absolute -inset-6 bg-gradient-to-l from-orange-50/50 to-orange-100/50 rounded-3xl -z-20 transition-all duration-700 ease-out"
            style={{
              transform: `rotate(${-1 - (scrollProgress * 1.5)}deg) scale(${0.9 + (scrollProgress * 0.1)})`,
              opacity: 0.2 + (scrollProgress * 0.3)
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
