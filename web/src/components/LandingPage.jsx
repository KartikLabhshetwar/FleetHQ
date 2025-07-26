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
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-orange-50">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DocumentationSection />
      <BenefitsSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
}
