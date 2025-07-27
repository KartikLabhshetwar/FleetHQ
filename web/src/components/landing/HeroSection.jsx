import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { ArrowRight, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const words = useMemo(() => ["Inspections", "Monitoring", "Surveys", "Security", "Mapping"], []);
  const typingSpeed = 120;
  const deletingSpeed = 80;
  const pauseTime = 1500;

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.substring(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentWord.substring(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-orange-900 leading-tight">
                Plan drone{" "}
                <span className="text-orange-600 relative inline-block min-w-[280px] text-left">
                  {typedText}
                  <span className="animate-pulse text-orange-500">|</span>
                </span>
                <br />
                <span className="text-gradient">with FleetHQ</span>
              </h1>
              
              <p className="text-xl text-orange-700 leading-relaxed max-w-lg">
                Enterprise-grade drone management platform for autonomous inspections, 
                monitoring, and surveys across global facilities.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {!isAuthenticated ? (
                <>
                  <Button 
                    size="lg" 
                    asChild
                    className="bg-orange-500 border border-orange-600 border-b-5 border-r-5 text-white hover:border-2 font-semibold px-8 py-4"
                  >
                    <Link to="/login">
                      Start Free Trial
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    asChild
                    className="border-orange-500 text-orange-600 border-b-5 border-r-5 hover:border-2 font-semibold px-8 py-4 rounded-lg"
                  >
                    <Link to="/documentation">
                      View Documentation
                    </Link>
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-orange-500 border border-orange-600 border-b-5 border-r-5 text-white hover:border-2 font-semibold px-8 py-4"
                >
                  <Link to="/dashboard">
                    Plan New Mission
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right Content - Drone Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/drone.png"
                alt="Enterprise Drone"
                className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
              />
            </div>
            
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-orange-200/30 rounded-3xl transform rotate-6 scale-110 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-orange-50/50 to-orange-100/30 rounded-3xl transform -rotate-3 scale-105 -z-20"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center animate-bounce-gentle">
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
            
            <div className="absolute bottom-10 left-10 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
