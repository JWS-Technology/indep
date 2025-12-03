import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import EventSection from '@/components/home/EventSection'
import TeamSection from '@/components/home/TeamSection'


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