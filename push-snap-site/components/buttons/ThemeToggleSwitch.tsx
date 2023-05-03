import { useState } from "react";
import { useTheme } from 'next-themes'

export default function Toggle() {
    const [darkMode, setDarkMode] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme()
    const currentTheme = theme === "system" ? systemTheme : theme ;

    const handleTheme = () => {
        setDarkMode(systemTheme === "dark" ? !darkMode : darkMode);
        setTheme( theme === "light" ? "dark": "light" );
    }

    return (
        <div className="flex">
            <label className="inline-flex relative items-center mr-5 cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    readOnly
                />
                <div
                    onClick={handleTheme}
                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                >
                </div>
            </label>
        </div>
    );
}