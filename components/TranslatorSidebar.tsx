'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: '신규 요청', href: '/translator/available' },
  { name: '진행 중인 작업', href: '/translator/working' },
  { name: '완료된 작업', href: '/translator/completed' },
  { name: '수익 관리', href: '/translator/earnings' },
  { name: '프로필 설정', href: '/translator/profile' },
];

export default function TranslatorSidebar() {
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
        <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-2">
          번역가
        </div>
        <div className="font-bold text-lg mb-1">김번역</div>
        <div className="text-sm text-gray-500">A등급 전문가</div>
        <div className="mt-2 text-xs text-gray-600">
          ⭐ 4.9 (128건)
        </div>
      </div>

      {/* Menu Section */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-4 text-gray-700">번역가 메뉴</h3>
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
                        ? 'bg-purple-50 text-purple-600 font-semibold'
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

      {/* Stats Card */}
      <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="text-xs text-gray-600 mb-2">이번 달 수익</div>
        <div className="text-2xl font-bold text-purple-600">₩2.4M</div>
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
