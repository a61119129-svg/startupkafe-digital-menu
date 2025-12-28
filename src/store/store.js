import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User Store - Authentication and preferences
export const useUserStore = create(
  persist(
    (set, get) => ({
      // User info
      user: null,
      isLoggedIn: false,
      hasSeenWelcome: false,
      
      // User preferences
      preferences: {
        name: '',
        phone: '',
        tableNumber: '',
        favoriteItems: [],
      },
      
      // Order history
      orderHistory: [],
      
      // Actions
      setHasSeenWelcome: (value) => set({ hasSeenWelcome: value }),
      
      login: (userData) => set({ 
        user: userData, 
        isLoggedIn: true,
        preferences: { ...get().preferences, ...userData }
      }),
      
      logout: () => set({ 
        user: null, 
        isLoggedIn: false,
        preferences: { name: '', phone: '', tableNumber: '', favoriteItems: [] }
      }),
      
      updatePreferences: (newPrefs) => set({ 
        preferences: { ...get().preferences, ...newPrefs }
      }),
      
      addToFavorites: (itemId) => {
        const favorites = get().preferences.favoriteItems;
        if (!favorites.includes(itemId)) {
          set({
            preferences: {
              ...get().preferences,
              favoriteItems: [...favorites, itemId]
            }
          });
        }
      },
      
      removeFromFavorites: (itemId) => {
        set({
          preferences: {
            ...get().preferences,
            favoriteItems: get().preferences.favoriteItems.filter(id => id !== itemId)
          }
        });
      },
      
      isFavorite: (itemId) => get().preferences.favoriteItems.includes(itemId),
      
      addOrder: (order) => {
        set({
          orderHistory: [
            { ...order, id: Date.now(), date: new Date().toISOString() },
            ...get().orderHistory
          ].slice(0, 10) // Keep last 10 orders
        });
      },
    }),
    {
      name: 'startup-kafe-user',
    }
  )
);

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      
      removeItem: (itemId) => {
        set({ items: get().items.filter(i => i.id !== itemId) });
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map(i =>
            i.id === itemId ? { ...i, quantity } : i
          )
        });
      },
      
      incrementQuantity: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity + 1);
        }
      },
      
      decrementQuantity: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity - 1);
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getItemQuantity: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        return item ? item.quantity : 0;
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'startup-kafe-cart',
    }
  )
);

// UI Store for app-wide UI state
export const useUIStore = create((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isItemDetailOpen: false,
  selectedItem: null,
  activeCategory: 'hot-beverages',
  searchQuery: '',
  isUserModalOpen: false,
  isAuthModalOpen: false,
  
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  
  openItemDetail: (item) => set({ isItemDetailOpen: true, selectedItem: item }),
  closeItemDetail: () => set({ isItemDetailOpen: false, selectedItem: null }),
  
  openUserModal: () => set({ isUserModalOpen: true }),
  closeUserModal: () => set({ isUserModalOpen: false }),
  
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// Toast Store for notifications
export const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    set({ toasts: [...get().toasts, { id, message, type }] });
    
    setTimeout(() => {
      set({ toasts: get().toasts.filter(t => t.id !== id) });
    }, duration);
  },
  
  removeToast: (id) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },
}));

// Order History Store
export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order) => {
        const newOrder = {
          ...order,
          id: Date.now(),
          date: new Date().toISOString(),
          status: 'confirmed',
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },
      
      getOrders: () => get().orders,
      
      getOrderById: (orderId) => get().orders.find(o => o.id === orderId),
    }),
    {
      name: 'startup-kafe-orders',
    }
  )
);
