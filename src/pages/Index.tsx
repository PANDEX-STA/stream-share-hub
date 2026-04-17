import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AvailabilityCounter from "@/components/AvailabilityCounter";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import TrustBadges from "@/components/TrustBadges";
import TestimonialsSection from "@/components/TestimonialsSection";
import AdminPanel from "@/components/AdminPanel";
import CTASection from "@/components/CTASection";
import PolicySection from "@/components/PolicySection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SocialProofToast from "@/components/SocialProofToast";
import MobileActionBar from "@/components/MobileActionBar";

const Index = () => (
  <div className="min-h-screen pb-20 md:pb-0">
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <AvailabilityCounter />
    <BenefitsSection />
    <HowItWorks />
    <TrustBadges />
    <TestimonialsSection />
    <AdminPanel />
    <CTASection />
    <PolicySection />
    <Footer />
    <WhatsAppButton />
    <SocialProofToast />
    <MobileActionBar />
  </div>
);

export default Index;
