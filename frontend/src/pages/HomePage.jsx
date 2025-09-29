import ChatAi from '@/components/ChatAi'
import Header from '@/components/Header'
import React from 'react'

const HomePage = () => {
    return (
        <div className="min-h-screen w-full relative">
            {/* Minty Cloud Drift Gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(120deg, #C8E6C9 0%, #DCEDC8 20%, #F1F8E9 40%, #FFFDE7 60%, #FFF9C4 80%, #F0F4C3 100%)`,
                }}
            />
            {/* Your Content/Components */}
            <div className="container relative z-10 pt-8 mx-auto">
                <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                    {/* Đầu Trang */}
                    <Header />
                    {/* Chat AI */}
                    <ChatAi />
                </div>
            </div>
        </div>

    )
}

export default HomePage
