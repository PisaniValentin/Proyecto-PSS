"use client";

import Navbar from "@/app/ui/components/layout/Navbar";
import Sidebar from "@/app/ui/components/layout/Sidebar";
import { Box } from "@mui/material";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#F3F4F6]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <Navbar />
                <Box className="p-8 flex-1 overflow-y-auto">{children}</Box>
            </div>
        </div>
    );
}
