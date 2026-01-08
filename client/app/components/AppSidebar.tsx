'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  //   DropdownMenu,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  UsersRound,
  Building2,
  User2,
  ChevronUp,
  CircleUserRound,
  ShieldUser,
  DoorOpen,
  MessageCircle,
  MessageCircleQuestionMark,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";


export function AppSidebar() {
  const user = useDashboardStore((state) => state.user);
  const logout = useDashboardStore((state) => state.logout);
  const pathname = usePathname()
  const router = useRouter()
  // menu items
  const items = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Users", icon: UsersRound, href: "/dashboard/users" },
    { label: "Sites", icon: Building2, href: "/dashboard/sites" },
    { label: "Visitors", icon: CircleUserRound, href: "/dashboard/visitors" },
    { label: "Guards", icon: ShieldUser, href: "/dashboard/guards" },
    { label: "Gates", icon: DoorOpen, href: "/dashboard/gates" },
  ];

  const supportItems = [
    { label: "Feedback", icon: MessageCircle, href: "/dashboard/feedback" },
    {
      label: "Support",
      icon: MessageCircleQuestionMark,
      href: "/dashboard/support",
    },
  ];
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="border-r border-slate-300"
    >
      {/* SIDEBAR HEADER */}
      <SidebarHeader />
      {/* <SidebarTrigger /> */}
      {/* </SidebarHeader> */}
      {/* SIDEBAR CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-semibold">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className={isActive ?"hover:bg-red-500/30 hover:text-red-500" : ''} asChild>
                    <a href={item.href} className={isActive ? "bg-red-500/20 text-red-500 font-bold" : ""}>
                      <item.icon className={isActive ? "text-red-500" : "text-slate-500"} />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* HELP AND SUPPORT */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-semibold">
            help and support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item, i) => {
                const isActive = pathname === item.href;
                return (<SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className={isActive ? "bg-red-500 text-white font-bold" : ""}>
                      <item.icon className={isActive ? "text-white" : "text-slate-500"} />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* SIDEBAR FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name || 'User'}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => {
                  logout()
                  router.push('/auth/login')
                }}
                >
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
