"use client"
import Breadcrumbs from '@/app/ui/breadcrumbs';
import _ from 'lodash';
import { Suspense } from 'react';
import RoleDetails from '@/app/ui/roleDetails';

export default function Page({ params }: { params: { id: string } }) {
    const id: string = params.id;

    return (
        <>
            <title>{id === 'new' ? 'Create Role' : 'Edit Role'}</title>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Roles', href: '/dashboard/roles' },
                    {
                        label: id === 'new' ? 'Create Role' : 'Edit Role',
                        href: `/dashboard/roles/${id}`,
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
                <RoleDetails id={id} />
            </Suspense>
        </>
    );
}
