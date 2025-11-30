import Hero from '@/components/Hero'
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
    </div>
  )
}