import { HomeContainer } from './_containers/home-container'
import { ServicesContainer } from './_containers/services-container'
import { FeaturedPackagesContainer } from './_containers/featured-packages-container'
import { PricingContainer } from './_containers/pricing-container'
import Navbar from './_components/blocks/navbar'
import { FloatingActionButtons } from './_components/floating-action-buttons'
import AboutUsSection from './_components/blocks/about-us-section'
import FooterSection from './_components/blocks/footer-section'

/**
 * HomePage — thin Server Component shell.
 *
 * ARCHITECTURE.md: pages import ONE container or compose a few top-level sections.
 * All interactive state and data fetching is delegated to containers in _containers/.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black dark font-sans">
      {/* Global navigation — presentational, no container needed */}
      <Navbar />
      <FloatingActionButtons />

      {/* Hero section — owns form-toggle state */}
      <HomeContainer />

      {/* Services section — fetches from /api/services */}
      <ServicesContainer />

      {/* Featured tours carousel — fetches from /api/packages/featured */}
      <FeaturedPackagesContainer />

      {/* Pricing section — fetches from /api/pricing */}
      <PricingContainer />

      {/* About Us — static/presentational */}
      <AboutUsSection />

      {/* Footer — static/presentational */}
      <FooterSection />
    </div>
  )
}
