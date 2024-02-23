"use client"
import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import _ from 'lodash';
import { getDepartments } from '@/app/lib/data';
import Pagination from '@/app/ui/pagination';
import { deleteDepartment } from '@/app/lib/actions';
import DeleteButton from '@/app/ui/deleteButton';
import Loading from '@/app/ui/loading';
import { DepartmentDetails } from '@/app/lib/definitions';

function Page({
	searchParams,
}: {
	searchParams?: {
		query?: string;
		page?: number;
	};
}) {
	const query = searchParams?.query || '';

	const [departments, setDepartments] = useState<DepartmentDetails[]>();
	const [totalPages, setTotalPages] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchDepartments = async () => {
		setIsLoading(true);

		let departments = await getDepartments();

		if (!_.isEmpty(departments)) {
			departments = departments.filter((department: DepartmentDetails) => department.departmentName.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

			setDepartments(departments);
			setTotalPages(Math.ceil(departments.length / 10));
			setIsLoading(false);

		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await fetchDepartments();
		}

		fetchData();
	}, [query]);

	const deleteHandler = async (id: string) => {
		await deleteDepartment(id);
		await fetchDepartments();
	};

	return (
		<>
			{isLoading && <Loading />}
			<title>Departments</title>
			<div className="w-full">
				<div className="w-full">
					<h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
						Departments
					</h1>
					<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
						<Search placeholder="Search departments..." />
						<Link
							href="/dashboard/departments/new"
							className="flex h-10 items-center rounded-lg bg-cyan-600 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							<span className="hidden md:block">Create Department</span>{' '}
							<PlusIcon className="h-5 md:ml-4" />
						</Link>
					</div>
					<div className="mt-6 flow-root">
						<div className="overflow-x-auto">
							<div className="inline-block min-w-full align-middle">
								<div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
									{/* mobile view */}


									{/* desktop view */}
									<table id="departmentsTable" className="hidden min-w-full rounded-md text-gray-900 md:table">
										<thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
											<tr>
												<th
													scope="col"
													className="px-4 py-5 font-medium sm:pl-6"
												>
													Department Name
												</th>
												<th
													scope="col"
													className="px-3 py-5 font-medium"
												>
													Active/Inactive
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
											{departments && departments.length > 0 && departments.map((department: DepartmentDetails) => (
												<tr key={department.id} className="group">
													<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
														<div className="flex items-center gap-3">
															<p>{department.departmentName}</p>
														</div>
													</td>
													<td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
														{department.active ? "Active" : "Inactive"}
													</td>
													<td className="whitespace-nowrap py-3 pl-6 pr-3">
														<div className="flex justify-end gap-3">
															<Link
																href={`/dashboard/departments/${department.id}`}
																className="rounded-md border p-2 hover:bg-gray-100"
															>
																<PencilIcon className="w-5" />
															</Link>
															<DeleteButton id={department.id} moduleName='Department' handleDelete={(id) => deleteHandler(id)} />
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
			</div>
		</>
	);
}

export default Page;