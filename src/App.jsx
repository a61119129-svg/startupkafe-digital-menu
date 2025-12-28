import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header, Footer, Cart, SearchModal, Toast, FloatingCartButton, ItemDetailModal, UserModal, AuthModal } from './components';
import { useUserStore } from './store/store';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Orders = lazy(() => import('./pages/Orders'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-dark-100/60 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const hasSeenWelcome = useUserStore((state) => state.hasSeenWelcome);
  
  if (!hasSeenWelcome) {
    return <Navigate to="/welcome" replace />;
  }
  
  return children;
}

function App() {
  const location = useLocation();
  const hasSeenWelcome = useUserStore((state) => state.hasSeenWelcome);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Refresh ScrollTrigger on route change
    ScrollTrigger.refresh();
  }, [location.pathname]);
  
  // Initialize GSAP defaults
  useEffect(() => {
    gsap.config({
      nullTargetWarn: false,
    });
    
    // Smooth scroll setup
    gsap.defaults({
      ease: 'power2.out',
      duration: 0.4,
    });
  }, []);
  
  const isCheckoutPage = location.pathname === '/checkout';
  const isWelcomePage = location.pathname === '/welcome';
  
  // Show welcome page without header/footer
  if (isWelcomePage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/welcome" element={
            hasSeenWelcome ? <Navigate to="/" replace /> : <Welcome />
          } />
        </Routes>
      </Suspense>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header - always visible */}
      <Header />
      
      {/* Main Content */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/welcome" element={
            hasSeenWelcome ? <Navigate to="/" replace /> : <Welcome />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      {/* Footer - hide on checkout */}
      {!isCheckoutPage && <Footer />}
      
      {/* Cart Drawer */}
      <Cart />
      
      {/* Search Modal */}
      <SearchModal />
      
      {/* Item Detail Modal */}
      <ItemDetailModal />
      
      {/* User Profile Modal */}
      <UserModal />
      
      {/* Auth Modal */}
      <AuthModal />
      
      {/* Floating Cart Button - hide on checkout */}
      {!isCheckoutPage && <FloatingCartButton />}
      
      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}

export default App;
