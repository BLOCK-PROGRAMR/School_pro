import React, { useState, useEffect } from "react";
import AccountantLayout from "./AccountantLayout";
import { Outlet } from "react-router-dom";
import { Sidebar } from "lucide-react";

const AccountantCheckbar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-screen">
            <AccountantLayout>
                <Outlet />
            </AccountantLayout>
        </div>
    );
};

export default AccountantCheckbar; 