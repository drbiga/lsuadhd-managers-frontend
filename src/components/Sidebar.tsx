import { ChevronLeft, ChevronRight, Clock, File, Goal, LayoutGrid, Settings } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DarkModeButton } from "./DarkModeButton";
import { useAuth } from "@/hooks/auth";
import iamService from "@/services/iam";
import LogOutButton from "./LogOutButton";
import { Button } from "./Button";

function SidebarLink({ active, collapsed, children, icon, to }: { active?: boolean; collapsed: boolean, icon: ReactNode, to: string, children: ReactNode }) {
    return (
        <li className={`
            text-white hover:bg-slate-500
            py-2 ${collapsed ? "px-2" : "px-8"}
            rounded-md cursor-pointer
            transition-all duration-100
            ${active ? "bg-slate-500" : ""}
            `
        }>
            <Link to={to} state={{ collapsed }}>
                {
                    collapsed
                        ? icon
                        : <div className="flex items-center gap-2">{icon} {children}</div>
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
            h-full bg-slate-700
            flex flex-col items-center justify-between py-8
            transition-all duration-100
            ${collapsed ? "w-[3vw] min-w-[75px]" : "w-[15vw] min-w-[250px]"}
        `}>
            <ul className="flex flex-col justify-around gap-4 mt-16">
                {
                    allowedContexts.includes('management') &&
                    <SidebarLink active={pathname === '/management'} to='/management' collapsed={collapsed} icon={<LayoutGrid />}>Management</SidebarLink>
                }
                {
                    allowedContexts.includes('session_execution') &&
                    <SidebarLink active={pathname === '/'} to='/' collapsed={collapsed} icon={<Clock />}>My Sessions</SidebarLink>
                }
                {
                    allowedContexts.includes('goals') &&
                    <SidebarLink active={pathname === '/goals'} to='/goals' collapsed={collapsed} icon={<Goal />}>My Goals</SidebarLink>
                }
            </ul>

            <div>
                <div className={`mb-16 flex gap-2 ${collapsed ? "flex-col items-center" : "items-center"}`}>
                    <DarkModeButton />
                    <LogOutButton />
                </div>

                <div className="flex justify-center">
                    <Button onClick={() => setCollapsed(!collapsed)}>
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