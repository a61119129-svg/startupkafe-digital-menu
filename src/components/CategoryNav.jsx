import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { menuData } from '../data/menuData';
import { useUIStore } from '../store/store';

gsap.registerPlugin(ScrollTrigger);

export default function CategoryNav() {
  const navRef = useRef(null);
  const { activeCategory, setActiveCategory } = useUIStore();
  
  useEffect(() => {
    const buttons = navRef.current?.querySelectorAll('button');
    
    gsap.fromTo(buttons,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.3
      }
    );
  }, []);
  
  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 160;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <nav 
      ref={navRef}
      className="sticky top-16 sm:top-20 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-2">
          {menuData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 btn-press ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-dark-100 hover:bg-primary-50 border border-cream-300'
              }`}
            >
              <span className="text-base">{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
