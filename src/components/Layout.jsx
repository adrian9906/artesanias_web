import Navbar from './Navbar'
import Footer from './Footer'
import { SmoothCursor } from './ui/smooth-cursor'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-forest-deep text-cream font-body antialiased">
      <SmoothCursor />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}
