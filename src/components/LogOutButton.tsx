import { useAuth } from "@/hooks/auth";
import { LogOut } from "lucide-react";
import { Button } from "./Button";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function LogOutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout]);

    return (
        <Button onClick={() => handleLogout()}>
            <LogOut />
        </Button>
    )
}
