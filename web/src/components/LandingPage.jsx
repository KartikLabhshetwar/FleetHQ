// Landing page components
import Navigation from "./landing/Navigation";
import HeroSection from "./landing/HeroSection";
import FeaturesSection from "./landing/FeaturesSection";
import DocumentationSection from "./landing/DocumentationSection";
import BenefitsSection from "./landing/BenefitsSection";
import CallToActionSection from "./landing/CallToActionSection";
import Footer from "./landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white relative text-gray-800">
      {/* Amber Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {/* Crosshatch Art - Light Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
          `,
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <DocumentationSection />
        <BenefitsSection />
        <CallToActionSection />
        <Footer />
      </div>
    </div>
  );
}
