"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                Global platform settings (payment gateways, email configuration, etc.) will be managed here.
            </p>
        </div>
    );
}
