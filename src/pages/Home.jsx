import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, Clock, MapPin, Star, ChevronRight, Coffee, 
  Flame, TrendingUp, Gift, Zap, ArrowRight, Heart, RefreshCw
} from 'lucide-react';
import { menuData, getItemsByCategory, getPopularItems } from '../data/menuData';
import { useUIStore, useUserStore } from '../store/store';
import MenuItem from '../components/MenuItem';
import CategoryNav from '../components/CategoryNav';
import Logo from '../components/Logo';
import { useLocation } from '../hooks/useLocation';

gsap.registerPlugin(ScrollTrigger);

// Promotional Banner Component
function PromoBanner({ banner, index }) {
  const bannerRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(bannerRef.current,
      { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        }
      }
    );
  }, [index]);
  
  return (
    <div 
      ref={bannerRef}
      className={`relative overflow-hidden rounded-2xl p-6 min-h-[180px] flex flex-col justify-between ${banner.gradient}`}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Icon */}
      <div className="relative">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
          {banner.icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative">
        <span className="inline-block bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
          {banner.badge}
        </span>
        <h3 className="text-white font-display font-bold text-xl mb-1">
          {banner.title}
        </h3>
        <p className="text-white/80 text-sm">
          {banner.subtitle}
        </p>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
    </div>
  );
}

// Quick Category Card
function QuickCategoryCard({ category, index }) {
  const cardRef = useRef(null);
  const { setActiveCategory } = useUIStore();
  
  const scrollToCategory = () => {
    const element = document.getElementById(category.id);
    if (element) {
      setActiveCategory(category.id);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        delay: index * 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=50',
        }
      }
    );
  }, [index]);
  
  return (
    <button
      ref={cardRef}
      onClick={scrollToCategory}
      className="flex flex-col items-center p-4 bg-white rounded-2xl border border-cream-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300 group min-w-[100px]"
    >
      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
        {category.emoji}
      </span>
      <span className="text-sm font-medium text-dark-100 text-center whitespace-nowrap">
        {category.name}
      </span>
    </button>
  );
}

// Featured Item Card (horizontal)
function FeaturedItemCard({ item, index }) {
  const cardRef = useRef(null);
  const { openItemDetail } = useUIStore();
  
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=50',
        }
      }
    );
  }, [index]);
  
  return (
    <button
      ref={cardRef}
      onClick={() => openItemDetail(item)}
      className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 group text-left"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          <span>4.8</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-display font-semibold text-dark-100 mb-1 line-clamp-1">
          {item.name}
        </h4>
        <p className="text-sm text-dark-100/60 line-clamp-1 mb-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg text-primary-600">
            ₹{item.price}
          </span>
          <span className="text-xs text-dark-100/50 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            10-15 min
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('');
  const { setActiveCategory } = useUIStore();
  const { preferences } = useUserStore();
  const { address: locationAddress, loading: locationLoading, refresh: refreshLocation } = useLocation();
  
  // Get greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setCurrentTime('Good morning');
    else if (hour < 17) setCurrentTime('Good afternoon');
    else setCurrentTime('Good evening');
  }, []);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      const heroElements = heroRef.current?.querySelectorAll('.hero-animate');
      gsap.fromTo(heroElements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
      
      // Parallax effect for hero
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      
      // Category section scroll animations
      const categoryObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const categoryId = entry.target.id;
              setActiveCategory(categoryId);
            }
          });
        },
        { rootMargin: '-40% 0px -60% 0px' }
      );
      
      menuData.categories.forEach((category) => {
        const element = document.getElementById(category.id);
        if (element) categoryObserver.observe(element);
      });
      
      return () => categoryObserver.disconnect();
    }, heroRef);
    
    return () => ctx.revert();
  }, [setActiveCategory]);
  
  const popularItems = getPopularItems().slice(0, 8);
  const featuredItems = getPopularItems().slice(0, 5);
  
  // Promotional banners data
  const promoBanners = [
    {
      id: 1,
      title: '20% OFF',
      subtitle: 'On all hot beverages before 11 AM',
      badge: 'MORNING SPECIAL',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      icon: <Coffee className="w-6 h-6 text-white" />
    },
    {
      id: 2,
      title: 'Combo Meals',
      subtitle: 'Save up to ₹100 on combos',
      badge: 'BEST VALUE',
      gradient: 'bg-gradient-to-br from-primary-500 to-teal-600',
      icon: <Gift className="w-6 h-6 text-white" />
    },
    {
      id: 3,
      title: 'New Items',
      subtitle: 'Try our latest additions',
      badge: 'JUST LAUNCHED',
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
      icon: <Zap className="w-6 h-6 text-white" />
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-20 sm:pt-24 pb-6 overflow-hidden"
      >
        {/* Background */}
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-primary-500/5 via-cream-50 to-cream-100" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B7F5E' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Greeting */}
          <div className="hero-animate mb-6">
            <p className="text-dark-100/60 text-sm font-medium mb-1">
              {currentTime}{preferences.name ? ',' : '!'} 
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-100">
              {preferences.name ? (
                <>Welcome back, <span className="gradient-text">{preferences.name}</span>!</>
              ) : (
                <>Welcome to <span className="gradient-text">Startup Kafé</span></>
              )}
            </h1>
            {preferences.tableNumber && (
              <div className="flex items-center gap-2 mt-2 text-sm text-dark-100/70">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Table {preferences.tableNumber}</span>
              </div>
            )}
          </div>
          
          {/* Info Pills */}
          <div className="hero-animate flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-cream-200">
              <Clock className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-dark-100">Open Now</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
            <button 
              onClick={refreshLocation}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-cream-200 hover:border-primary-300 transition-colors group"
            >
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-dark-100 max-w-[180px] truncate">
                {locationLoading ? 'Getting location...' : (locationAddress || 'Get Location')}
              </span>
              <RefreshCw className={`w-3.5 h-3.5 text-dark-100/40 group-hover:text-primary-500 transition-colors ${locationLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* Promotional Banners Carousel */}
          <div className="hero-animate -mx-4 px-4 mb-8">
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
              {promoBanners.map((banner, index) => (
                <div key={banner.id} className="snap-start flex-shrink-0 w-[85%] sm:w-[300px]">
                  <PromoBanner banner={banner} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Categories */}
      <section className="py-6 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-dark-100">
              Categories
            </h2>
            <button className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {menuData.categories.map((category, index) => (
              <QuickCategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Items (Horizontal Scroll) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-dark-100">
                Today's Featured
              </h2>
            </div>
            <button className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              See All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="pl-4 sm:pl-6 lg:pl-8">
            <div className="flex gap-4 overflow-x-auto pb-4 pr-4 no-scrollbar">
              {featuredItems.map((item, index) => (
                <FeaturedItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Navigation (Sticky) */}
      <CategoryNav />
      
      {/* Main Content */}
      <main ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Popular Items Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-dark-100">Most Popular</h2>
              <p className="text-sm text-dark-100/60">Loved by our customers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {popularItems.map((item, index) => (
              <MenuItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </section>
        
        {/* Mid-page Banner */}
        <section className="mb-12">
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500 rounded-3xl overflow-hidden p-6 sm:p-8">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  FIRST ORDER BONUS
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  Get 15% OFF on your first order!
                </h3>
                <p className="text-white/80 mb-4 sm:mb-0">
                  Use code <span className="font-bold text-white">STARTUP15</span> at checkout
                </p>
              </div>
              <button className="shrink-0 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Decorative */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -right-5 -top-5 w-20 h-20 bg-white/10 rounded-full" />
          </div>
        </section>
        
        {/* Categories Sections */}
        {menuData.categories.map((category) => {
          const categoryItems = getItemsByCategory(category.id);
          
          return (
            <section 
              key={category.id} 
              id={category.id} 
              className="mb-12 scroll-mt-40"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{category.emoji}</span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-dark-100">
                    {category.name}
                  </h2>
                  <p className="text-sm text-dark-100/60">
                    {categoryItems.length} items available
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {categoryItems.map((item, index) => (
                  <MenuItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
