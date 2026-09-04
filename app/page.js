import HeroCarousel from "@/components/pages/Home/HeroCarousel";
import CategoryGrid from "@/components/pages/Home/CategoryGrid";
import HeritageLegacy from "@/components/pages/Home/HeritageLegacy";
import DigitalAtelier from "@/components/pages/Home/DigitalAtelier";
import WhyChooseElmas from "@/components/pages/Home/WhyChooseElmas";
import BestSellers from "@/components/pages/Home/BestSellers";
import Testimonials from "@/components/pages/Home/Testimonials";
import InstagramStories from "@/components/pages/Home/InstagramStories";
import PaymentMethods from "@/components/pages/Home/PaymentMethods";
import SocialAtelier from "@/components/pages/Home/SocialAtelier";
import ServiceHighlights from "@/components/pages/Home/ServiceHighlights";
import FeaturesGrid from "@/components/pages/Home/FeaturesGrid";
import CtaBanner from "@/components/pages/Home/CtaBanner";
import ShopByBudgetSection from "@/components/pages/Home/ShopByBudgetSection";

export default function HomePage() {
  return (
    <div className="bg-cream-100">
      <HeroCarousel />
      <CategoryGrid />
      <ShopByBudgetSection/>
      <HeritageLegacy />
      <DigitalAtelier />
      <WhyChooseElmas />
      <BestSellers />
      <Testimonials />
      <InstagramStories />
      {/* <SocialAtelier /> */}
      <FeaturesGrid />
      <PaymentMethods />
      <ServiceHighlights /> 
      <CtaBanner />
    </div>
  );
}