import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import SectionTitle from '@/components/SectionTitle'

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />

      <SectionTitle
        title="Welcome to INDEP 2025"
        subtitle="Inter Departmental Cultural Events"
      />
    </div>
  )
}