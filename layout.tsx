export const metadata = {
  title: 'VoltKeep',
  description: 'Never miss a license, cert, or insurance renewal again.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
