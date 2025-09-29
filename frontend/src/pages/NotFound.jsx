import React from 'react'

const NotFound = () => {
    return (
        <div className="min-h-screen w-full ">
            {/* Minty Cloud Drift Gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(120deg, #C8E6C9 0%, #DCEDC8 20%, #F1F8E9 40%, #FFFDE7 60%, #FFF9C4 80%, #F0F4C3 100%)`,
                }}
            />
            {/* Your Content/Components */}
            <div className='flex flex-col items-center justify-center min-h-screen text-center bg-slate-50 relative'>
                <img src="404_NotFound.png" alt='Not Found' className='max-w-full mb-6 w-96' />

                <p className='text-xl font-semibold'>
                    Đi nhầm đường rồi!
                </p>
                <a href='/' className='inline-block px-6  py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark'>
                    quay về trang chủ
                </a>
            </div>
        </div>

    )
}

export default NotFound
