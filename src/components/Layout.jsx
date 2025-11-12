import Spline from '@splinetool/react-spline'
import { ShoppingCart, Search, Menu } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function Layout({ children, showHero = false }) {
  const [q, setQ] = useState('')
  const { count } = useCart()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-20 backdrop-blur bg-white/60 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-white/50">
            <Menu className="w-5 h-5" />
          </button>
          <a href="/" className="font-bold text-lg">eStore</a>
          <div className="hidden md:flex items-center ml-4 gap-2 flex-1">
            <div className="flex-1 relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/?q=${encodeURIComponent(q)}`)}
                placeholder="Search gadgets, wearables, more..."
                className="w-full rounded-full border border-gray-200 bg-white/70 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => (window.location.href = `/?q=${encodeURIComponent(q)}`)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <a href="/cart" className="ml-auto relative p-2 rounded hover:bg-white/50">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-blue-600 text-white rounded-full min-w-4 h-4 px-1 grid place-items-center">{count}</span>
            )}
          </a>
        </div>
      </header>

      <main className="pt-14">
        {showHero && (
          <section className="relative h-[60vh] md:h-[72vh] w-full overflow-hidden">
            <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-10 md:bottom-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold">Shop the future of electronics</h1>
                <p className="mt-2 text-gray-600 max-w-xl">Discover curated gadgets and accessories with fast checkout and secure payments.</p>
                <div className="mt-4 flex items-center gap-3">
                  <a href="#catalog" className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 shadow hover:bg-blue-700 transition">
                    Browse products
                  </a>
                  <a href="/cart" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow border border-gray-200 hover:bg-gray-50 transition">
                    Go to cart
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
        {children}
      </main>

      <footer className="mt-16 border-t border-gray-200/60">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} eStore. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <a href="/" className="hover:text-gray-900">Home</a>
            <a href="/cart" className="hover:text-gray-900">Cart</a>
            <a href="/test" className="hover:text-gray-900">Status</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
