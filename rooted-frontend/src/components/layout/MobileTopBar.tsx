import React from 'react';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { SheetTrigger } from '../ui/sheet';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export function MobileTopBar() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/diagnosis': return t('sidebar.diagnosis', 'Check your soil');
      case '/chat': return t('sidebar.chat', 'The Arborist');
      case '/goals': return t('sidebar.goals', 'Tending the garden');
      case '/history': return t('sidebar.history', 'Growth rings');
      case '/insights': return t('sidebar.insights', 'The Mycelium Network');
      default: return 'Rooted';
    }
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-canvas/95 backdrop-blur-md border-b border-border/50 z-40 flex items-center justify-between px-4 print:hidden">
      <SheetTrigger asChild>
        <button className="p-2 -ml-2 text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded-md">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>

      <span className="font-body text-sm font-medium text-secondary">
        {getPageTitle()}
      </span>

      {/* Tapping avatar could open a settings sheet later, for now just aesthetic */}
      <Avatar className="w-8 h-8 ring-1 ring-sage-200">
        <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
}
