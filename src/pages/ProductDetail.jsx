import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProductDetail() {
  const { id } = useParams()
  const [prod, setProd] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`${backendBase}/products/${id}`)
      .then((r) => r.json())
      .then((d) => mounted && setProd(d))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>
  if (!prod) return <div className="max-w-6xl mx-auto px-4 py-10">Not found</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square">
        {prod.image ? (
          <img src={prod.image} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{prod.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-yellow-500">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span className="text-sm text-gray-600">{(prod.rating || 4.5).toFixed(1)}</span>
        </div>
        <p className="mt-3 text-gray-600">{prod.description}</p>
        <div className="mt-4 text-3xl font-bold">${Number(prod.price).toFixed(2)}</div>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={() => addToCart(prod, 1)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 hover:bg-blue-700">
            <ShoppingCart className="w-4 h-4" /> Add to cart
          </button>
          <a href="/cart" className="rounded-full border border-gray-200 px-5 py-2 hover:bg-gray-50">Go to cart</a>
        </div>
      </div>
    </div>
  )
}
