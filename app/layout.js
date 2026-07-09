import './globals.css';

export const metadata = {
  metadataBase: new URL('https://vibeleak.ai'),
  title: {
    default: 'VibeLeak AI | Love, Personality & Future Score Tests',
    template: '%s | VibeLeak AI'
  },
  description: 'Take fun, calculated AI-style tests for ex comeback, crush compatibility, toxicity score, rarity score and future rich or broke potential.',
  keywords: ['ex comeback predictor','crush compatibility test','toxicity score test','how rare are you','future rich or broke','relationship quiz India','AI personality test'],
  openGraph: {
    title: 'VibeLeak AI',
    description: 'Discover what your answers reveal about love, attraction, personality and future potential.',
    type: 'website',
    url: 'https://vibeleak.ai'
  }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
