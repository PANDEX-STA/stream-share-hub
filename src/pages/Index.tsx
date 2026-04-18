import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import TrustBadges from "@/components/TrustBadges";
import CTASection from "@/components/CTASection";
import PolicySection from "@/components/PolicySection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileActionBar from "@/components/MobileActionBar";

const Index = () => (
  <div className="min-h-screen pb-20 md:pb-0">
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <BenefitsSection />
    <HowItWorks />
    <TrustBadges />
    <CTASection />
    <PolicySection />
    <Footer />
    <WhatsAppButton />
    <MobileActionBar />
  </div>
);

export default Index;
