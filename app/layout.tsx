
import '../styles/globals.css';

export const metadata = {
  title: "Nabu",
  description: "Lobby UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
