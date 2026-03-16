import { HeroBanner } from '../components/marketing/HeroBanner'
import { LandingNav } from '../components/marketing/landing/LandingNav'
import { FeaturesSection } from '../components/marketing/landing/FeaturesSection'
import { CTASection } from '../components/marketing/landing/CTASection'
import { Footer } from '../components/marketing/landing/Footer'

export default function HomePage() {
  return (
    <div className="bg-white">
      <LandingNav />
      <HeroBanner />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
