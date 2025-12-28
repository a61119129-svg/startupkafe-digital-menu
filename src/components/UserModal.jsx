import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { X, User, MapPin, Heart, Clock, Settings, LogOut, ChevronRight, Edit2, Save, Package } from 'lucide-react';
import { useUIStore, useUserStore, useOrderStore } from '../store/store';

export default function UserModal() {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTable, setEditTable] = useState('');
  
  const { isUserModalOpen, closeUserModal } = useUIStore();
  const { preferences, updatePreferences, setHasSeenWelcome, logout } = useUserStore();
  const { orders } = useOrderStore();
  
  useEffect(() => {
    setEditName(preferences.name || '');
    setEditTable(preferences.tableNumber || '');
  }, [preferences]);
  
  useEffect(() => {
    if (isUserModalOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.fromTo(contentRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(contentRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });
    }
  }, [isUserModalOpen]);
  
  const handleSave = () => {
    updatePreferences({ name: editName.trim(), tableNumber: editTable.trim() });
    setIsEditing(false);
  };
  
  const handleReset = () => {
    setHasSeenWelcome(false);
    logout();
    closeUserModal();
    window.location.reload();
  };
  
  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-[70] ${isUserModalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0"
        onClick={closeUserModal}
      />
      
      {/* Content */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[2rem] overflow-hidden shadow-2xl translate-y-full"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="relative px-6 pb-6 pt-2">
          <button
            onClick={closeUserModal}
            className="absolute top-0 right-4 w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-dark-100" />
          </button>
          
          {/* Profile Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-500/30 mb-4">
              {preferences.name ? (
                <span className="font-bold text-3xl">
                  {preferences.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            
            {!isEditing ? (
              <>
                <h2 className="font-display text-xl font-bold text-dark-100 text-center">
                  {preferences.name || 'Guest User'}
                </h2>
                {preferences.tableNumber && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-dark-100/60">
                    <MapPin className="w-4 h-4" />
                    <span>Table {preferences.tableNumber}</span>
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 mt-3 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </>
            ) : (
              <div className="w-full max-w-xs space-y-3 mt-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                />
                <input
                  type="text"
                  value={editTable}
                  onChange={(e) => setEditTable(e.target.value)}
                  placeholder="Table number"
                  className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 text-dark-100/70 font-medium rounded-xl hover:bg-cream-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="px-6 pb-8 space-y-2 max-h-[50vh] overflow-y-auto">
          {/* Favorites */}
          <Link 
            to="/favorites"
            onClick={closeUserModal}
            className="w-full flex items-center justify-between p-4 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-dark-100 block">My Wishlist</span>
                <span className="text-sm text-dark-100/60">
                  {preferences.favoriteItems?.length || 0} items saved
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-100/40 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {/* Order History */}
          <Link 
            to="/orders"
            onClick={closeUserModal}
            className="w-full flex items-center justify-between p-4 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-dark-100 block">My Orders</span>
                <span className="text-sm text-dark-100/60">
                  {orders?.length || 0} previous orders
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-100/40 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {/* Settings */}
          <button className="w-full flex items-center justify-between p-4 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-dark-100 block">Settings</span>
                <span className="text-sm text-dark-100/60">App preferences</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-100/40 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Reset / Start Fresh */}
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group mt-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-red-600 block">Start Fresh</span>
                <span className="text-sm text-red-500/70">Clear all data & restart</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
