import React, { Suspense } from 'react';
import { Outlet, } from 'react-router-dom';


const LayoutWrapper: React.FC<{ isAuthenticated?: boolean }> = () => {
    return (
        <>
            <Suspense fallback={<p>...loading</p>}>
                <div className='w-full h-[100vh]' style={{ position: 'relative', }}>
                    <Outlet />
                </div>
            </Suspense>
        </>
    );
}

export default LayoutWrapper;
