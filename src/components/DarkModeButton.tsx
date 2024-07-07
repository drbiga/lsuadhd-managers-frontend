import { useCallback, useState } from "react";
import { Button } from "./Button";
import { Moon, Sun } from "lucide-react";

export function DarkModeButton() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const html = document.getElementById('html');
        if (html) {
            return html.classList.contains('dark')
        }
    });

    const toggleDarkMode = useCallback(() => {
        const html = document.getElementById('html');
        if (isDarkMode) {
            html?.classList.remove('dark')
            setIsDarkMode(false);
        } else {
            html?.classList.add('dark');
            setIsDarkMode(true);
        }
    }, [isDarkMode])

    return (
        <Button type="button" onClick={() => toggleDarkMode()}>
            {isDarkMode ? (
                <Moon />
            ) : (
                <Sun />
            )}
        </Button>
    )
}