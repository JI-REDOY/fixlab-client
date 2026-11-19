import HeroSection from "@/components/home/HeroSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";

export default function Home() {
  return (
    <div className="w-full bg-[#F8F9FA] pb-10 flex flex-col items-center">
      <HeroSection />
      <FeaturedServices />
      <HowItWorks />
      <PopularCategories />
    </div>
  );
}