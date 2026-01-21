import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
    title: 'Sarasi Institute Dashboard',
    description: 'Manage students, classes, and payments.',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            {/* Sidebar (Desktop Only) */}
            <Sidebar />

            {/* Main Content Area */}
            {/* 
           Merge Logic: 
           - Default: Full width (mobile)
           - md+: ml-64 (Push content to the right to accommodate 256px sidebar)
           - Header is layout-aware? No, Header is usually inside this flow or parallel.
       */}
            <div className="md:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
