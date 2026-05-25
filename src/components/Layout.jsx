import Navbar from './Navbar'
import Footer from './Footer'
import { SmoothCursor } from './ui/smooth-cursor'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-forest-deep text-cream font-body antialiased">
      <SmoothCursor />
      <Navbar />
      <main className="w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  )
}
