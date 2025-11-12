import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart-items')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart-items', JSON.stringify(items))
    } catch {}
  }, [items])

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i._id === product._id)
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty }
        return next
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i._id !== productId))
  }

  const clearCart = () => setItems([])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0), [items])
  const tax = useMemo(() => Math.round(subtotal * 0.1 * 100) / 100, [subtotal])
  const total = useMemo(() => Math.round((subtotal + tax) * 100) / 100, [subtotal, tax])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = { items, addToCart, removeFromCart, clearCart, subtotal, tax, total, count }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
