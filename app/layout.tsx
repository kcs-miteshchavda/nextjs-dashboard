import '@/app/ui/global.css';
import { inter } from './ui/fonts';
import { Metadata } from 'next';
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: {
		template: '%s | Mnds Dashboard',
		default: 'Mnds Dashboard',
	},
	description: 'The official Next.js Learn Dashboard built with App Router.',
	metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<Toaster position="bottom-center" />
				{children}
			</body>
		</html>
	);
}
