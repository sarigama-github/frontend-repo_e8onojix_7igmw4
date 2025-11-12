import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { ShoppingCart, Search, Menu, Star, ChevronRight } from 'lucide-react'

const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useProducts(query) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const url = useMemo(() => {
    const u = new URL(`${backendBase}/products`)
    if (query?.q) u.searchParams.set('q', query.q)
    if (query?.category) u.searchParams.set('category', query.category)
    return u.toString()
  }, [query])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return
        setItems(data.items || [])
      })
      .finally(() => isMounted && setLoading(false))
    return () => {
      isMounted = false
    }
  }, [url])

  return { items, loading }
}

function Navbar({ onSearch }) {
  const [q, setQ] = useState('')
  return (
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
              onKeyDown={(e) => e.key === 'Enter' && onSearch(q)}
              placeholder="Search gadgets, wearables, more..."
              className="w-full rounded-full border border-gray-200 bg-white/70 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => onSearch(q)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button className="ml-auto relative p-2 rounded hover:bg-white/50">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-blue-600 text-white rounded-full w-4 h-4 grid place-items-center">0</span>
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[72vh] w-full overflow-hidden">
      <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-10 md:bottom-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold">Shop the future of electronics</h1>
          <p className="mt-2 text-gray-600 max-w-xl">Discover curated gadgets and accessories with fast checkout and secure payments.</p>
          <div className="mt-4 flex items-center gap-3">
            <a href="#catalog" className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 shadow hover:bg-blue-700 transition">
              Browse products <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#deals" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow border border-gray-200 hover:bg-gray-50 transition">
              Today’s deals
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-3 shadow-sm hover:shadow-md transition flex flex-col">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        {p.image ? (
          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      <div className="mt-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{p.title}</h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm text-gray-600">{(p.rating || 4.5).toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">${Number(p.price).toFixed(2)}</span>
        <button onClick={() => onAdd(p)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
          <ShoppingCart className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  )
}

function Catalog() {
  const [query, setQuery] = useState({ q: '' })
  const { items, loading } = useProducts(query)

  const handleAdd = async (p) => {
    // simple cart-less demo: create an order with single item
    const payload = {
      items: [{ product_id: p._id, quantity: 1 }],
      customer_name: 'Guest',
      customer_email: 'guest@example.com',
      shipping_address: 'N/A'
    }
    const res = await fetch(`${backendBase}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    alert(`Order placed! Total: $${data.total?.toFixed?.(2) || data.total}`)
  }

  const seed = async () => {
    await fetch(`${backendBase}/seed`, { method: 'POST' })
    // refresh
    setQuery({ ...query })
  }

  return (
    <section id="catalog" className="relative z-10 -mt-12 md:-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">Featured products</h2>
          <div className="flex items-center gap-2">
            <button onClick={seed} className="text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">Seed demo data</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse h-64 rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p._id} p={p} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200/60">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} eStore. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Support</a>
        </nav>
      </div>
    </footer>
  )
}

export default function App() {
  const [searchQ, setSearchQ] = useState('')
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onSearch={(q) => setSearchQ(q)} />
      <main className="pt-14">
        <Hero />
        <Catalog />
        <Footer />
      </main>
    </div>
  )
}
