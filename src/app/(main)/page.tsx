import { NavbarContainer } from "./_containers/landing/navbar-container";
import { HomeContainer } from "./_containers/landing/home-container";
import { ServicesContainer } from "./_containers/landing/services-container";
import { FeaturedPackagesContainer } from "./_containers/landing/featured-packages-container";
import { PricingContainer } from "./_containers/landing/pricing-container";
import { AboutUsContainer } from "./_containers/landing/about-us-container";
import { FooterSection } from "./_components/landing/footer-section";
import { FloatingActionButtons } from "./_components/floating-action-buttons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black dark font-sans overflow-x-hidden">
      <NavbarContainer />
      <div className="relative">
        <FloatingActionButtons />
      </div>

      <HomeContainer />

      <ServicesContainer />

      <FeaturedPackagesContainer />

      <PricingContainer />

      <AboutUsContainer />

      <FooterSection />
    </div>
  );
}
