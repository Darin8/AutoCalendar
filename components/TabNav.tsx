'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TabNav() {
  const pathname = usePathname();

  const tabs = [{ name: 'Home', href: '/' }];

  return (
    <div className="border-b">
      <nav className="container mx-auto flex space-x-8 px-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive =
            (tab.href === '/' && pathname === '/') ||
            (tab.href !== '/' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'border-b-2 py-4 px-1 text-sm font-medium'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
