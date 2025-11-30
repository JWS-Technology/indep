import './globals.css';

export const metadata = {
  title: 'INDEP 2025 - Cultural Extravaganza',
  description: 'Inter-Departmental Cultural Festival at St. Joseph\'s College',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-linear-to-br from-gray-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}