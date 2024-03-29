"use client"
import Breadcrumbs from '@/app/ui/breadcrumbs';
import _ from 'lodash';
import { Suspense } from 'react';
import UserDetails from '@/app/ui/userDetails';

export default function Page({ params }: { params: { id: string } }) {
    const id: string = params.id;

    return (
        <>
            <title>{id === 'new' ? 'Create User' : 'Edit User'}</title>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Users', href: '/dashboard/users' },
                    {
                        label: id === 'new' ? 'Create User' : 'Edit User',
                        href: `/dashboard/users/${id}`,
                        active: true,
                    },
                ]}
            />

            <div className="card flex justify-content-center">
            </div>
            <Suspense
                key={id}
                fallback={"loading..."}
            >
                <UserDetails id={id} />
            </Suspense>
        </>
    );
}
