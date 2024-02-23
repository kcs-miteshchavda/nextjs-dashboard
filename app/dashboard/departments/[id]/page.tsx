"use client"
import Breadcrumbs from '@/app/ui/breadcrumbs';
import _ from 'lodash';
import { Suspense } from 'react';
import DepartmentDetails from '@/app/ui/departmentDetails';

export default function Page({ params }: { params: { id: string } }) {
    const id: string = params.id;

    return (
        <>
            <title>{id === 'new' ? 'Create Department' : 'Edit Department'}</title>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Departments', href: '/dashboard/departments' },
                    {
                        label: id === 'new' ? 'Create Department' : 'Edit Department',
                        href: `/dashboard/departments/${id}`,
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
                <DepartmentDetails id={id} />
            </Suspense>
        </>
    );
}
