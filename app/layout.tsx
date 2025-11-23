import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'INDEP 2025 - Cultural Extravaganza',
  description: 'Inter-Departmental Cultural Festival at St. Joseph\'s College',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-linear-to-br from-gray-50 to-blue-50 min-h-screen">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}