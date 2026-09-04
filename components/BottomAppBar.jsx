'use client';
import { Home, Heart, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCustomer } from '@/context/CustomerContext';

export default function BottomAppBar() {
  const pathname = usePathname();
  const { customer, cartCount, wishlistCount } = useCustomer();

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', count: wishlistCount },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', count: cartCount },
    { href: customer ? '/account/orders' : '/auth/login', icon: User, label: customer ? 'Account' : 'Login' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-300 shadow-2xl md:hidden">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-forest-700' : 'text-cream-500'
              } hover:text-forest-600`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {link.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-forest-700 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
                    {link.count}
                  </span>
                )}
              </div>
              <span className={`font-sans text-[9px] tracking-wider uppercase mt-1 ${
                isActive ? 'font-semibold' : 'font-normal'
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
