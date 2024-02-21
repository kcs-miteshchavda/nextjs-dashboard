"use client"
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import _ from 'lodash';
import { Suspense } from 'react';
import UserDetails from '@/app/ui/users/userDetails';

// export const metadata: Metadata = {
//     title: 'Edit User',
// };

export default async function Page({ params }: { params: { id: string } }) {
    const id: string = params.id;

    // const user: User | null = !_.isEmpty(users) ? users[0] : null;
    // if (_.isEmpty(user)) {
    //     notFound();
    // }

    return (
        <div>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Users', href: '/dashboard/users' },
                    {
                        label: id === 'new' ? 'Create User Details' : 'Edit User Details',
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
        </div>
    );
}
