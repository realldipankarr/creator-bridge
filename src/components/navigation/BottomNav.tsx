import React from 'react';
import { Home, Briefcase, UserCircle, HelpCircle } from 'lucide-react';

export type DashboardTab = 'home' | 'opportunities' | 'profile' | 'help';

interface BottomNavProps {
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navItems: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition min-w-[64px] min-h-[44px] ${
              isActive
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
