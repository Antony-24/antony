import type { Metadata } from "next";
import "./globals.css";
import StarDustParticles from "@/components/StarDustParticles";

export const metadata: Metadata = {
  title: "Antony Francis | React Developer",
  description: "Personal portfolio of Antony Francis, a professional React developer specializing in seamless user experiences and scalable web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground relative">
        <StarDustParticles />
        {children}
      </body>
    </html>
  );
}
