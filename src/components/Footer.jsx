import Logo from './Logo';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-200 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-xl p-2">
                <Logo className="h-16 w-auto" />
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your favorite neighborhood café serving fresh coffee, delicious food, 
              and good vibes. Perfect for startup founders, remote workers, and food lovers.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:hello@startupkafe.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@startupkafe.com</span>
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-4 h-4 mt-1" />
                <span>104 S.N BANERJEE ROAD,<br />KOLKATA - 700120</span>
              </div>
            </div>
          </div>
          
          {/* Hours & Social */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Opening Hours</h4>
            <div className="space-y-2 text-white/70 text-sm mb-6">
              <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 9:00 AM - 11:00 PM</p>
            </div>
            
            <h4 className="font-display font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Startup Kafé. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
