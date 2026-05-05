import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import '@/styles/globals.css';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'OMNIVOID LABS - Experimental Sound & Visual Art Platform',
  description: 'Explore the intersection of sound science, technology, and consciousness through immersive audio-visual experiences. Discover research papers, live transmissions, and experimental art at OMNIVOID LABS.',
  keywords: ['experimental music', 'sound art', 'visual art', 'audio-visual', 'technology', 'consciousness', 'research', 'live transmissions', 'electronic music', 'ambient', 'drone', 'glitch', 'noise', 'digital art', 'interactive media'],
  authors: [{ name: 'OMNIVOID LABS' }],
  openGraph: {
    type: 'website',
    url: 'https://omnivoidlabs.com/',
    title: 'OMNIVOID LABS - Experimental Sound & Visual Art Platform',
    description: 'Explore the intersection of sound science, technology, and consciousness through immersive audio-visual experiences. Discover research papers, live transmissions, and experimental art.',
    images: [{ url: '/share-image.png', width: 1200, height: 630, alt: 'OMNIVOID LABS' }],
    siteName: 'OMNIVOID LABS',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OMNIVOID LABS - Experimental Sound & Visual Art Platform',
    description: 'Explore the intersection of sound science, technology, and consciousness through immersive audio-visual experiences.',
    images: ['/share-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#99ccff" />
        <meta name="msapplication-TileColor" content="#111111" />
      </head>
      <body className={`${spaceMono.variable} font-mono`}>
        {children}
      </body>
    </html>
  );
}