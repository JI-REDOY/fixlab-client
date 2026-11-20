import HeroSection from "@/components/home/HeroSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import MarqueeSection from "@/components/home/MarqueeSection";
import TopTechnicians from "@/components/home/TopTechnicians";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="relative z-10 pt-10">
        <FeaturedServices />
        <MarqueeSection /> 
        <HowItWorks />
        <PopularCategories />
        <TopTechnicians />
      </div>
    </>
  );
}