import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import SectionTitle from '@/components/SectionTitle'
import About from '@/components/About'
import EventSection from '@/components/EventSection'
import TeamSection from '@/components/TeamSection'


export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <TeamSection />
      <EventSection />
      {/* <Stats /> */}
      {/* <SectionTitle /> */}
    </div>
  )
}