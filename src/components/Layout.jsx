import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-forest-deep text-cream font-body antialiased">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}
