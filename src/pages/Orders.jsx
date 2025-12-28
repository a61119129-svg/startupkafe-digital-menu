import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  CreditCard,
  ChefHat,
  Truck,
  Star,
  RefreshCcw,
  Receipt,
  Calendar,
  MapPin
} from 'lucide-react';
import { useOrderStore, useCartStore, useToastStore } from '../store/store';

const statusConfig = {
  confirmed: { 
    icon: CheckCircle, 
    color: 'text-green-500 bg-green-50', 
    label: 'Confirmed',
    description: 'Order received'
  },
  preparing: { 
    icon: ChefHat, 
    color: 'text-orange-500 bg-orange-50', 
    label: 'Preparing',
    description: 'Being prepared'
  },
  ready: { 
    icon: Package, 
    color: 'text-blue-500 bg-blue-50', 
    label: 'Ready',
    description: 'Ready for pickup'
  },
  delivered: { 
    icon: Truck, 
    color: 'text-primary-500 bg-primary-50', 
    label: 'Delivered',
    description: 'Order complete'
  },
};

function OrderCard({ order, onReorder }) {
  const cardRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const statusStyle = statusConfig[order.status]?.color || 'text-gray-500 bg-gray-50';
  const statusLabel = statusConfig[order.status]?.label || order.status;
  
  const orderDate = new Date(order.date);
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-dark-100/50 mb-1">Order #{order.id}</p>
            <div className="flex items-center gap-2 text-sm text-dark-100/70">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{formattedTime}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusStyle}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{statusLabel}</span>
          </div>
        </div>
        
        {/* Items preview */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, idx) => (
              <div 
                key={idx}
                className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-cream-100"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-dark-100/30" />
                  </div>
                )}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-10 rounded-lg border-2 border-white bg-cream-100 flex items-center justify-center">
                <span className="text-xs font-medium text-dark-100/70">
                  +{order.items.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-dark-100 truncate">
              {order.items.map(i => i.name).join(', ')}
            </p>
            <p className="text-xs text-dark-100/60">
              {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-primary-600">₹{order.total}</p>
            <p className="text-xs text-dark-100/60">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-cream-200 p-4 bg-cream-50/50">
          {/* Order Items */}
          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-dark-100/60">{item.quantity}x</span>
                  <span className="text-dark-100">{item.name}</span>
                </div>
                <span className="font-medium text-dark-100">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          {/* Price breakdown */}
          <div className="border-t border-cream-200 pt-3 mb-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-dark-100/60">Subtotal</span>
              <span className="text-dark-100">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-100/60">Taxes</span>
              <span className="text-dark-100">₹{order.taxes}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-cream-200">
              <span className="text-dark-100">Total</span>
              <span className="text-primary-600">₹{order.total}</span>
            </div>
          </div>
          
          {/* Customer info */}
          {order.customer && (
            <div className="bg-white rounded-xl p-3 mb-4">
              <p className="text-sm font-medium text-dark-100 mb-1">{order.customer.name}</p>
              <p className="text-xs text-dark-100/60">{order.customer.phone}</p>
              {order.customer.notes && (
                <p className="text-xs text-dark-100/60 mt-1 italic">"{order.customer.notes}"</p>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onReorder(order)}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Reorder
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 text-dark-100 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Receipt className="w-4 h-4" />
              Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const pageRef = useRef(null);
  const ordersRef = useRef([]);
  
  const orders = useOrderStore((state) => state.orders);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  
  useEffect(() => {
    // Page entrance animation
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, []);
  
  const handleReorder = (order) => {
    order.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addItem(item);
      }
    });
    addToast(`${order.items.length} items added to cart`, 'success');
  };
  
  // Group orders by date
  const groupedOrders = orders.reduce((groups, order) => {
    const date = new Date(order.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});
  
  return (
    <div ref={pageRef} className="min-h-screen bg-cream-50 pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-dark-100" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-dark-100 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-500" />
              My Orders
            </h1>
            <p className="text-dark-100/60 text-sm">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
        </div>
        
        {orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-primary-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark-100 mb-3">
              No orders yet
            </h2>
            <p className="text-dark-100/60 mb-8 max-w-sm mx-auto">
              Your order history will appear here once you place your first order
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <ChefHat className="w-5 h-5" />
              Browse Menu
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {Object.entries(groupedOrders).map(([date, dateOrders]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-dark-100/60 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {date}
                </h3>
                <div className="space-y-3">
                  {dateOrders.map((order, index) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onReorder={handleReorder}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Stats */}
        {orders.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Your Stats
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-display font-bold">{orders.length}</p>
                <p className="text-sm text-white/80">Orders</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold">
                  {orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
                </p>
                <p className="text-sm text-white/80">Items</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold">
                  ₹{orders.reduce((sum, o) => sum + o.total, 0)}
                </p>
                <p className="text-sm text-white/80">Total Spent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
