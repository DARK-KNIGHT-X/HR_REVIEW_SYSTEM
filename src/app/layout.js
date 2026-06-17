import './globals.css';

export const metadata = {
  title: 'Crystal People · Crystal Group',
  description: 'Monthly performance check-ins for the Crystal Group team.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-paper text-ink min-h-screen">{children}</body>
    </html>
  );
}