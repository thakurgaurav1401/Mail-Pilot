
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, LayoutDashboard, Edit3, Users, LayoutTemplate, Wand2, Settings, PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/compose', label: 'Compose Email', icon: Edit3 },
  { href: '/recipients', label: 'Recipients', icon: Users },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/optimizer', label: 'AI Optimizer', icon: Wand2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!hasMounted) {
    // Render a static placeholder during SSR and initial client render
    // This version avoids TooltipProvider and other complex interactive elements
    const defaultIsCollapsed = false; // Match the initial state for placeholder
    return (
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          defaultIsCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex items-center border-b border-sidebar-border p-4", defaultIsCollapsed ? "justify-center" : "justify-between")}>
          {!defaultIsCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Mail className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-bold">MailPilot</span>
            </Link>
          )}
           {/* Static placeholder for the toggle button */}
           <div className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 w-9 p-0" // Mimics Button variant="ghost" size="icon"
            )}>
            {defaultIsCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </div>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "",
                  defaultIsCollapsed ? "justify-center" : ""
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn("h-5 w-5", defaultIsCollapsed ? "mx-auto" : "")} />
                {!defaultIsCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!defaultIsCollapsed && (
            <div className="mt-auto border-t border-sidebar-border p-4 text-center text-xs">
              © {new Date().getFullYear()} MailPilot
            </div>
        )}
      </aside>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex items-center border-b border-sidebar-border p-4", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Mail className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-bold">MailPilot</span>
            </Link>
          )}
           <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            <span className="sr-only">{isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
          </Button>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "",
                      isCollapsed ? "justify-center" : ""
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>
        {!isCollapsed && (
            <div className="mt-auto border-t border-sidebar-border p-4 text-center text-xs">
              © {new Date().getFullYear()} MailPilot
            </div>
        )}
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
