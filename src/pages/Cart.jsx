import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CartPage() {
  const { items, removeFromCart, subtotal, tax, total, clearCart } = useCart()
  const [placing, setPlacing] = useState(false)
  const hasItems = items.length > 0

  const placeOrder = async () => {
    if (!hasItems) return
    setPlacing(true)
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i._id, quantity: i.quantity })),
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
      clearCart()
      window.location.href = '/'
    } catch (e) {
      alert('Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {!hasItems ? (
        <div className="text-gray-600">Your cart is empty. <a href="/" className="text-blue-600 underline">Start shopping</a>.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => (
              <div key={i._id} className="flex items-center gap-4 p-4 border rounded-xl bg-white/70">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  {i.image ? <img src={i.image} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <a href={`/product/${i._id}`} className="font-semibold hover:underline">{i.title}</a>
                  <div className="text-sm text-gray-600">Qty: {i.quantity}</div>
                </div>
                <div className="font-semibold mr-4">${(Number(i.price) * i.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(i._id)} className="p-2 rounded hover:bg-gray-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border rounded-xl bg-white/70 h-fit">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm mb-1"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-lg mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button disabled={placing} onClick={placeOrder} className="mt-4 w-full rounded-full bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-60">
              {placing ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
