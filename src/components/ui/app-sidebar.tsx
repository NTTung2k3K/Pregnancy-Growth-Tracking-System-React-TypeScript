"use client";

import {
  ChevronDown,
  LogOut,
  User2,
  HomeIcon as House,
  UserCog,
  Users,
  Package,
  BookMarked,
  UserPen,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/routes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  CookiesEmployee2Service,
  CookiesEmployeeService,
} from "@/services/cookies.service";
import { User } from "@/containers/Dashboard/Appointment";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

// Define navigation items for Doctor role
const doctorNav = [
  {
    title: "Main",
    icon: House,
    url: ROUTES.DASHBOARD_DOCTOR,
  },
  {
    title: "Services",
    icon: UserCog,
    items: [
      {
        title: "Appointments",
        url: ROUTES.DASHBOARD_APPOINTMENT,
      },
      {
        title: "Children",
        url: ROUTES.DASHBOARD_CHILDREN,
      },
      {
        title: "Growth Charts",
        url: ROUTES.DASHBOARD_DOCTOR_GROWTH_CHARTS,
      },
    ],
  },
  {
    title: "Profile",
    icon: UserPen,
    url: ROUTES.DASHBOARD_EMPLOYEE_PROFILE,
  },
];

// Define navigation items for Admin role
const adminNav = [
  {
    title: "Main",
    icon: House,
    url: ROUTES.DASHBOARD_MAIN,
  },
  {
    title: "Teammate",
    icon: UserCog,
    items: [
      {
        title: "Doctor",
        url: ROUTES.DASHBOARD_EMPLOYEES,
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    url: ROUTES.DASHBOARD_USERS,
  },
  {
    title: "CarePass",
    icon: Package,
    items: [
      {
        title: "Membership Packages",
        url: ROUTES.DASHBOARD_MEMBERSHIPPACKAGE,
      },
      {
        title: "Payment",
        url: "/dashboard/payments",
      },
      {
        title: "Appointment Templates",
        url: ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES,
      },
    ],
  },
  // {
  //   title: "Appointment Template",
  //   icon: SquareMousePointer,
  //   url: ROUTES.DASHBOARD_APPOINTMENT,
  // },
  {
    title: "Blog",
    icon: BookMarked,
    items: [
      {
        title: "Blogs",
        url: ROUTES.DASHBOARD_BLOGS,
      },
      {
        title: "Blog Types",
        url: ROUTES.DASHBOARD_BLOGTYPES,
      },
    ],
  },
  {
    title: "Growth Charts",
    icon: Package,
    url: ROUTES.DASHBOARD_GROWTH_CHARTS,
  },
];

export function AppSidebar() {
  // Get role from localStorage as in your original code
  const role = localStorage.getItem("role");
  const navigation = role === "Admin" ? adminNav : doctorNav;

  const logout = () => {
    CookiesEmployeeService.remove();
    CookiesEmployee2Service.remove();

    window.location.href = ROUTES.EMPLOYEE_LOGIN;
  };
  const user = CookiesEmployee2Service.get();
  if (user == null) {
    CookiesEmployeeService.remove();
    CookiesEmployee2Service.remove();

    window.location.href = ROUTES.EMPLOYEE_LOGIN;
  }
  const dataUser = user ? (JSON.parse(user) as User) : null;

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="bg-transparent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <img
                  className="rounded-md"
                  src="/assets/images/logo.png"
                  alt="logo"
                  height={50}
                  width={50}
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">BabyCare system</span>
                <span className="text-xs text-muted-foreground">
                  {role} Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          size={"lg"}
                          className="w-full bg-transparent"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton size="md" asChild>
                                <a href={subItem.url}>{subItem.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild size={"lg"}>
                      <a href={item.url}>
                        <item.icon className="size-4 text-black" />
                        <span className="text-black">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-transparent">
                <SidebarMenuButton size={"lg"}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        dataUser?.image ||
                        "https://th.bing.com/th/id/R.869baf58b63f64a47cd521691eae7bf6?rik=%2bjP33WJBQzowcA&pid=ImgRaw&r=0"
                      }
                      alt={dataUser?.fullName}
                    />
                  </Avatar>
                  <span>{dataUser?.fullName}</span>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="start"
                side="right"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = ROUTES.DASHBOARD_EMPLOYEE_PROFILE)
                  }
                >
                  <User2 className="mr-2 size-10" />
                  Profile
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Settings className="mr-2 size-10" />
                  Settings
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="" onClick={logout}>
                  <LogOut className="mr-2 size-10" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
