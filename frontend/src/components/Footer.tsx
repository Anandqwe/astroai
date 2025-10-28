import React from 'react';
import { FaGithub, FaLinkedin, FaRocket } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-dark/95 border-t border-primary/20 py-10 px-0 mt-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FaRocket className="text-primary text-3xl" />
              <h3 className="text-white text-xl">AstroAI</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Exploring the cosmos with NASA data and AI technology
            </p>
          </div>

          <div>
            <h4 className="text-white text-xl mb-4">Quick Links</h4>
            <ul className="list-none">
              {[
                { href: '/', label: 'Home' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/chat', label: 'Ask Astro' },
                { href: '/about', label: 'About' }
              ].map(link => (
                <li key={link.href} className="mb-2.5">
                  <a 
                    href={link.href} 
                    className="text-gray-400 no-underline transition-all duration-300 hover:text-primary hover:pl-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xl mb-4">Connect</h4>
            <div className="flex gap-4">
              {[
                { href: 'https://github.com', icon: FaGithub, label: 'GitHub' },
                { href: 'https://linkedin.com', icon: FaLinkedin, label: 'LinkedIn' }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-gray-400 text-xl no-underline transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-1 hover:shadow-glow"
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center pt-5 border-t border-primary/20">
          <p className="text-gray-400 my-1">&copy; {currentYear} AstroAI. All rights reserved.</p>
          <p className="text-gray-400 text-sm opacity-70 my-1">
            Powered by NASA APIs & AI Technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
