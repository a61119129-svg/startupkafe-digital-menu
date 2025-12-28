import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Coffee, ArrowRight, Sparkles, Heart, Clock, Utensils } from 'lucide-react';
import { useUserStore } from '../store/store';
import Logo from '../components/Logo';

export default function Welcome() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const setHasSeenWelcome = useUserStore((state) => state.setHasSeenWelcome);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      const tl = gsap.timeline();
      
      tl.fromTo('.welcome-bg-circle', 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo('.welcome-logo',
        { scale: 0.5, opacity: 0, rotation: -20 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
        '-=0.5'
      )
      .fromTo('.welcome-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo('.welcome-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo('.welcome-features > *',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      )
      .fromTo('.welcome-cta',
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.2'
      );
      
      // Floating animation for decorative elements
      gsap.to('.float-element', {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []);
  
  const handleGetStarted = () => {
    // Animate out current content
    gsap.to('.step-0', {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setStep(1)
    });
  };
  
  const handleSubmit = () => {
    if (name.trim()) {
      updatePreferences({ name: name.trim(), tableNumber: tableNumber.trim() });
    }
    setHasSeenWelcome(true);
    
    // Animate out
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => navigate('/')
    });
  };
  
  const handleSkip = () => {
    setHasSeenWelcome(true);
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => navigate('/')
    });
  };
  
  useEffect(() => {
    if (step === 1) {
      gsap.fromTo('.step-1',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [step]);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="welcome-bg-circle absolute -top-32 -right-32 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl" />
        <div className="welcome-bg-circle absolute -bottom-32 -left-32 w-96 h-96 bg-primary-800/30 rounded-full blur-3xl" />
        
        {/* Floating food icons */}
        <div className="float-element absolute top-20 left-10 text-white/10">
          <Coffee size={60} />
        </div>
        <div className="float-element absolute top-40 right-10 text-white/10">
          <Utensils size={50} />
        </div>
        <div className="float-element absolute bottom-40 left-20 text-white/10">
          <Heart size={40} />
        </div>
        <div className="float-element absolute bottom-20 right-20 text-white/10">
          <Sparkles size={45} />
        </div>
        
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {step === 0 && (
          <div className="step-0 text-center max-w-md">
            {/* Logo */}
            <div className="welcome-logo mb-8">
              <div className="w-44 h-36 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Logo className="w-full h-full" />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="welcome-title font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Welcome to<br />
              <span className="text-cream-200">Startup Kafé</span>
            </h1>
            
            <p className="welcome-subtitle text-lg text-white/80 mb-10">
              Your destination for amazing coffee and delicious food. Order easily, enjoy instantly!
            </p>
            
            {/* Features */}
            <div className="welcome-features grid grid-cols-3 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-white/90 font-medium">Fresh Coffee</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-white/90 font-medium">70+ Items</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-white/90 font-medium">Quick Order</span>
              </div>
            </div>
            
            {/* CTA */}
            <button
              onClick={handleGetStarted}
              className="welcome-cta group w-full bg-white text-primary-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span className="text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleSkip}
              className="mt-4 text-white/60 hover:text-white text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
        
        {step === 1 && (
          <div className="step-1 w-full max-w-md">
            {/* Back indicator */}
            <div className="text-center mb-8">
              <div className="w-32 h-24 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 mb-6">
                <Logo className="w-full h-full" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Personalize Your Experience
              </h2>
              <p className="text-white/70">
                Tell us a bit about yourself (optional)
              </p>
            </div>
            
            {/* Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Table Number (if dining in)
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Start Exploring Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <button
              onClick={handleSkip}
              className="w-full mt-4 text-white/70 hover:text-white py-3 text-sm transition-colors"
            >
              Continue without personalizing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
