import EnvelopeReveal from '@/components/EnvelopeReveal'
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import CountdownTimer from '@/components/CountdownTimer'
import VenueSection from '@/components/VenueSection'
import EventSchedule from '@/components/EventSchedule'
import LoveStory from '@/components/LoveStory'
import Gallery from '@/components/Gallery'
import Accommodations from '@/components/Accommodations'
import Registry from '@/components/Registry'
import RSVPForm from '@/components/RSVPForm'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  return (
    <EnvelopeReveal>
      <a href="#countdown" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <main>
        <HeroSection />
        <CountdownTimer />
        <VenueSection />
        <EventSchedule />
        <LoveStory />
        <Gallery />
        <Accommodations />
        <Registry />
        <RSVPForm />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </EnvelopeReveal>
  )
}
