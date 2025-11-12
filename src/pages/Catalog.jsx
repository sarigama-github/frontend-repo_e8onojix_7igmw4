import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

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

function ProductCard({ p, onAdd }) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-3 shadow-sm hover:shadow-md transition flex flex-col">
      <a href={`/product/${p._id}`} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        {p.image ? (
          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No image</div>
        )}
      </a>
      <div className="mt-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <a href={`/product/${p._id}`} className="font-semibold line-clamp-1 hover:underline">{p.title}</a>
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

export default function CatalogPage() {
  const [query, setQuery] = useState({ q: '' })
  const { items, loading } = useProducts(query)
  const { addToCart } = useCart()

  const seed = async () => {
    await fetch(`${backendBase}/seed`, { method: 'POST' })
    setQuery({ ...query })
  }

  return (
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
            <ProductCard key={p._id} p={p} onAdd={(prod) => addToCart(prod, 1)} />
          ))}
        </div>
      )}
    </div>
  )
}
