"use client"
import AdminLayout from '@/components/auth/admin-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}   