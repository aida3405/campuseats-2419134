import { useContext } from 'react'
import { CartContext } from './cart-context.js'

export function useCart() {
    //read context
    const context = useContext(CartContext)
    if (!context) {
        //throw error if used outside provider
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}