import React from 'react';

export const userRoutes = [
    {
        path: '/game',
        name: 'Game',
        exact: true,
        component: React.lazy(() => import("../View/Game/Game.tsx")),
    },
    {
        path: '/join',
        name: 'Join',
        exact: true,
        component: React.lazy(() => import("../View/Join/Join.tsx")),
    },
    {
        redirectRoute: true,
        path: '/game',
        name: 'game',
    },
]

export const guestRoutes = [
    {
        path: '/join',
        name: 'Join',
        exact: true,
        component: React.lazy(() => import("../View/Join/Join.tsx")),
    },
    {
        path: '/game',
        name: 'Game',
        exact: true,
        component: React.lazy(() => import("../View/Game/Game.tsx")),
    },
    {
        redirectRoute: true,
        path: '/join',
        name: 'Join',
    },
]