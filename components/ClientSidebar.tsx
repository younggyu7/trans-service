'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: '새 의뢰 등록', href: '/client/request/new' },
  { name: '내 의뢰 목록', href: '/client/requests' },
  { name: '결제 내역', href: '/client/payments' },
  { name: '프로필 설정', href: '/client/profile' },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-gray-50 min-h-screen border-r border-gray-200 py-6 px-4 flex flex-col">
      {/* Profile Section */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-3 overflow-hidden">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-2">
          의뢰인
        </div>
        <div className="font-bold text-lg mb-1">김의뢰</div>
        <div className="text-sm text-gray-500">client@example.com</div>
      </div>

      {/* Menu Section */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-4 text-gray-700">의뢰자 메뉴</h3>
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Support Link */}
      <div className="mt-auto pt-8 border-t border-gray-200">
        <a href="#" className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center py-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          고객 지원
        </a>
      </div>
    </aside>
  );
}
