import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout d-flex bg-light min-vh-100">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="dashboard-main-content flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
                <div className="container-fluid p-3 p-md-4">
                    <DashboardTopbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
