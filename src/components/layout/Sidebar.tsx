
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, LayoutDashboard, Edit3, Users, LayoutTemplate, Wand2, Settings, PanelLeft, PanelRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/compose', label: 'Compose Email', icon: Edit3 },
  { href: '/recipients', label: 'Recipients', icon: Users },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/optimizer', label: 'AI Optimizer', icon: Wand2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const SidebarNavigation = ({ collapsed }: { collapsed?: boolean }) => (
    <>
      <div className={cn("flex items-center border-b border-sidebar-border p-4", collapsed && !isMobile ? "justify-center" : "justify-between")}>
        {!(collapsed && !isMobile) && (
          <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <Mail className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-bold">MailPilot</span>
          </Link>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleDesktopSidebar} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            {collapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            <span className="sr-only">{collapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const linkContent = (
            <>
              <item.icon className={cn("h-5 w-5", (collapsed && !isMobile) ? "mx-auto" : "")} />
              {!(collapsed && !isMobile) && <span>{item.label}</span>}
            </>
          );
          const linkClassName = cn(
            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "",
            (collapsed && !isMobile) ? "justify-center" : ""
          );

          if (collapsed && !isMobile) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} onClick={handleLinkClick} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
                    {linkContent}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return (
            <Link key={item.href} href={item.href} onClick={handleLinkClick} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
              {linkContent}
            </Link>
          );
        })}
      </nav>
      {!(collapsed && !isMobile) && (
          <div className="mt-auto border-t border-sidebar-border p-4 text-center text-xs">
            © {new Date().getFullYear()} MailPilot
          </div>
      )}
    </>
  );


  if (!hasMounted) {
    return (
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-bold">MailPilot</span>
            </div>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground opacity-0 pointer-events-none">
                <PanelLeft className="h-5 w-5" />
            </Button>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <div key={item.href} className="flex items-center gap-3 rounded-md px-3 py-2">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="mt-auto border-t border-sidebar-border p-4 text-center text-xs">
          © {new Date().getFullYear()} MailPilot
        </div>
      </aside>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-[280px] bg-sidebar p-0 text-sidebar-foreground flex flex-col overflow-y-auto">
           <SheetHeader className="p-4 border-b border-sidebar-border flex flex-row items-center justify-between sticky top-0 bg-sidebar z-10">
            <SheetTitle className="text-sidebar-foreground">MailPilot</SheetTitle>
            <SheetClose className="text-sidebar-foreground ring-offset-sidebar hover:text-sidebar-accent-foreground focus:ring-sidebar-ring" />
          </SheetHeader>
          <div className="flex flex-col flex-grow"> {/* Wrapper for content to scroll */}
            <SidebarNavigation collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          isDesktopCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarNavigation collapsed={isDesktopCollapsed} />
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
