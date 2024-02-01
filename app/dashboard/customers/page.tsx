import Table from '@/app/ui/customers/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Customers',
};
export default async function Page({
	searchParams,
}: {
	searchParams?: {
		query?: string;
	};
}) {
	const query = searchParams?.query || '';
	return (
		<div className="w-full">
			<Suspense
				key={query}
				fallback={<InvoicesTableSkeleton />}
			>
				<Table query={query} />
			</Suspense>
		</div>
	);
}
