import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variationId?: string;
    // addons...
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, variationId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variationId?: string) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) =>
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.productId === newItem.productId && item.variationId === newItem.variationId
                    );

                    if (existingItemIndex > -1) {
                        const updatedItems = [...state.items];
                        updatedItems[existingItemIndex].quantity += newItem.quantity;
                        return { items: updatedItems };
                    }

                    return { items: [...state.items, newItem] };
                }),
            removeItem: (productId, variationId) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.productId === productId && item.variationId === variationId)
                    ),
                })),
            updateQuantity: (productId, quantity, variationId) =>
                set((state) => {
                    if (quantity <= 0) {
                        return { items: state.items.filter(i => !(i.productId === productId && i.variationId === variationId)) };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.productId === productId && item.variationId === variationId
                                ? { ...item, quantity }
                                : item
                        ),
                    };
                }),
            clearCart: () => set({ items: [] }),
            total: () => {
                const items = get().items;
                return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
