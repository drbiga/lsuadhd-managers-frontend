import { ChevronLeft, ChevronRight, Group, LayoutGrid, Milestone, Users, Wallet, AlertTriangle, FileText } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DarkModeButton } from "@/components/common/DarkModeButton";
import { useAuth } from "@/hooks/auth";
import iamService from "@/services/iam";
import { LogOutButton } from "@/components/common/LogOutButton";
import { Button } from "@/components/common/Button";
import { RouteNames } from "@/Routes";

function SidebarLink({ active, collapsed, children, icon, to }: { active?: boolean; collapsed: boolean, icon: ReactNode, to: string, children: ReactNode }) {
    return (
        <li className={`
            text-sidebar-foreground hover:bg-sidebar-hover
            py-3 ${collapsed ? "px-3" : "px-6"}
            rounded-lg cursor-pointer
            transition-all duration-200
            ${active ? "bg-sidebar-active shadow-sm" : ""}
            `
        }>
            <Link to={to} state={{ collapsed }} className="focus:outline-none focus:ring-2 focus:ring-accent rounded-lg">
                {
                    collapsed
                        ? icon
                        : <div className="flex items-center gap-3 font-medium">{icon} {children}</div>
                }
            </Link>
        </li >
    );
}

export default function Sidebar() {
    const [allowedContexts, setAllowedContexts] = useState<string[]>([]);
    const { pathname, state } = useLocation();

    const { authState } = useAuth();

    useEffect(() => {
        (async () => {
            if (authState && authState.session && authState.session.user) {
                const contexts = await iamService.searchContexts(authState.session.user.role);
                setAllowedContexts(contexts.map(c => c.name));
            }
        })()
    }, [authState]);

    const [collapsed, setCollapsed] = useState(() => {
        if (state && state.collapsed) {
            return true;
        }
        return false;
    });


    return (
        <div className={`
            h-full bg-sidebar border-r border-border
            flex flex-col items-center justify-between py-8
            transition-all duration-300 ease-in-out
            ${collapsed ? "w-[5vw]" : "w-[20vw]"}
        `}>
            <ul className="flex flex-col justify-around gap-3 mt-16 w-full px-4">
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.MANAGEMENT} to={RouteNames.MANAGEMENT} collapsed={collapsed} icon={<LayoutGrid />}>Management</SidebarLink>
                }
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.SESSION_GROUPS} to={RouteNames.SESSION_GROUPS} collapsed={collapsed} icon={<Group />}>Session Groups</SidebarLink>
                }
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.MANAGEMENT__STUDENTS} to={RouteNames.MANAGEMENT__STUDENTS} collapsed={collapsed} icon={<Users />}>Students</SidebarLink>
                }
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.SESSION_PROGRESS} to={RouteNames.SESSION_PROGRESS} collapsed={collapsed} icon={<Milestone />}>Session Progress</SidebarLink>
                }
                {/* {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.TRACKING_STATS} to={RouteNames.TRACKING_STATS} collapsed={collapsed} icon={<BarChart />}>Tracking Data Stats</SidebarLink>
                } */}
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.BUDGET} to={RouteNames.BUDGET} collapsed={collapsed} icon={<Wallet />}>Budget</SidebarLink>
                }
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.FAILED_SESSIONS} to={RouteNames.FAILED_SESSIONS} collapsed={collapsed} icon={<AlertTriangle />}>Failed Sessions</SidebarLink>
                }
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === RouteNames.SESSION_SUMMARY} to={RouteNames.SESSION_SUMMARY} collapsed={collapsed} icon={<FileText />}>Session Summary</SidebarLink>
                }
            </ul>

            <div className="text-sidebar-foreground w-full px-4">
                <div className={`mb-16 flex gap-2 ${collapsed ? "flex-col items-center" : "items-center justify-center"}`}>
                    <DarkModeButton className="bg-sidebar-hover text-sidebar-foreground hover:bg-sidebar-active border-0" />
                    <LogOutButton className="bg-sidebar-hover text-sidebar-foreground hover:bg-sidebar-active border-0" />
                </div>

                <div className="flex justify-center">
                    <Button className="bg-sidebar-hover text-sidebar-foreground hover:bg-sidebar-active border-0" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? (
                            <ChevronRight />
                        ) : (
                            <ChevronLeft />
                        )}
                    </Button>
                </div>
            </div>
        </div >
    );
}