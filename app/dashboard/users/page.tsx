import Table from '@/app/ui/customers/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import _ from 'lodash';
import axios from "axios";
import { getUsers } from '@/app/lib/data';
import UserPlaceholder from "../../../images/users/user_placeholder_img.png";
import Pagination from '@/app/ui/invoices/pagination';
// import DataTable from 'datatables.net-dt';

// new DataTable('#usersTable', {
//     search: true
// });
type User = {
	id: string,
	name: string,
	email: string,
	image_url: string
}


export const metadata: Metadata = {
	title: 'Customers',
};
export default async function Page({
	searchParams,
}: {
	searchParams?: {
		query?: string;
		page?: number;
	};
}) {
	// const users = await fetchFilteredCustomers(query);
	const query = searchParams?.query || '';
	const page = searchParams?.page || '';

	let users: User[] = await getUsers();
	let totalPages: number = Math.ceil(users.length / 10);
	console.log(typeof page, ' pages');

	if (!_.isEmpty(users)) {

		users = users.filter((user: User) =>
			user.email.toLocaleLowerCase().includes(query.toLocaleLowerCase()) || user.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
		
		totalPages = Math.ceil(users.length / 10);
	}
	// new DataTable('#example');
	return (
		<div className="w-full">
			<Suspense
				key={query}
				fallback={<InvoicesTableSkeleton />}
			>
				<div className="w-full">
					<h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
						Users
					</h1>
					<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
						<Search placeholder="Search users..." />
						<Link
							href="/dashboard/users/new"
							className="flex h-10 items-center rounded-lg bg-cyan-600 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							<span className="hidden md:block">Create User</span>{' '}
							<PlusIcon className="h-5 md:ml-4" />
						</Link>
					</div>
					<div className="mt-6 flow-root">
						<div className="overflow-x-auto">
							<div className="inline-block min-w-full align-middle">
								<div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
									<div className="md:hidden">
										{users?.map((user: User) => (
											<div
												key={user.id}
												className="mb-2 w-full rounded-md bg-white p-4"
											>
												<div className="flex items-center justify-between border-b pb-4">
													<div>
														<div className="mb-2 flex items-center">
															<div className="flex items-center gap-3">
																<Image
																	src={UserPlaceholder}
																	className="rounded-full"
																	alt={`${user.name}'s profile picture`}
																	width={28}
																	height={28}
																/>
																<p>{user.name}123</p>
															</div>
														</div>
														<p className="text-sm text-gray-500">
															{user.email}
														</p>
													</div>
													<div className="flex justify-end gap-2">
														<Link
															href={`/dashboard/users/${user.id}`}
															className="rounded-md border p-2 hover:bg-gray-100"
														>
															<PencilIcon className="w-5" />
														</Link>
														<button className="rounded-md border p-2 hover:bg-gray-100">
															<span className="sr-only">Delete</span>
															<TrashIcon className="w-5" />
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
									<table id="usersTable" className="hidden min-w-full rounded-md text-gray-900 md:table">
										<thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
											<tr>
												<th
													scope="col"
													className="px-4 py-5 font-medium sm:pl-6"
												>
													Name
												</th>
												<th
													scope="col"
													className="px-3 py-5 font-medium"
												>
													Email
												</th>
												<th
													scope="col"
													className="relative py-3 pl-6 pr-3"
												>
													<span className="sr-only">Edit</span>
												</th>
											</tr>
										</thead>

										<tbody className="divide-y divide-gray-200 text-gray-900">
											{users.map((user: User) => (
												<tr key={user.id} className="group">
													<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
														<div className="flex items-center gap-3">
															<Image
																src={UserPlaceholder}
																className="rounded-full"
																alt={`${user.name}'s profile picture`}
																width={28}
																height={28}
															/>
															<p>{user.name}</p>
														</div>
													</td>
													<td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
														{user.email}
													</td>
													<td className="whitespace-nowrap py-3 pl-6 pr-3">
														<div className="flex justify-end gap-3">
															<Link
																href={`/dashboard/users/${user.id}`}
																className="rounded-md border p-2 hover:bg-gray-100"
															>
																<PencilIcon className="w-5" />
															</Link>
															<button className="rounded-md border p-2 hover:bg-gray-100">
																<span className="sr-only">Delete</span>
																<TrashIcon className="w-5" />
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-5 flex w-full justify-center">
						<Pagination totalPages={totalPages} />
					</div>
				</div>
			</Suspense>
		</div>
	);
}
