import "./globals.css";

export const metadata = {
  title: "Минимальное приложение",
  description: "Минимальный пример Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
