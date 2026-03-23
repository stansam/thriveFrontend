import { HomeContainer } from './_containers/landing/home-container'
import { ServicesContainer } from './_containers/landing/services-container'
import { FeaturedPackagesContainer } from './_containers/landing/featured-packages-container'
import { PricingContainer } from './_containers/landing/pricing-container'
import Navbar from './_components/landing/navbar'
import { FloatingActionButtons } from './_components/floating-action-buttons'
import AboutUsSection from './_components/landing/about-us-section'
import FooterSection from './_components/landing/footer-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black dark font-sans overflow-x-hidden">
      <Navbar />
      <div className="relative">
        <FloatingActionButtons />
      </div>

      <HomeContainer />

      <ServicesContainer />

      <FeaturedPackagesContainer />

      <PricingContainer />

      <AboutUsSection />

      <FooterSection />
    </div>
  )
}
