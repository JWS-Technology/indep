import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import SectionTitle from '@/components/SectionTitle'
import About from '@/components/About'


export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Stats />
      {/* <SectionTitle/> */}
    </div>
  )
}