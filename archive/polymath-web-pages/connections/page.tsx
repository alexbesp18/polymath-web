import { getAllDomains } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { KNOWN_ISOMORPHISMS } from '@/lib/hub-books';
import { generatePairing, formatPairingForDisplay } from '@/lib/bisociation';

export const revalidate = 60;

export default async function ConnectionsPage() {
  const domains = await getAllDomains();

  // Generate a bisociation pairing
  const pair = generatePairing(domains, [], 3);
  const pairDisplay = pair ? formatPairingForDisplay(pair) : null;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
        Cross-Domain Connections
      </h1>

      {/* Bisociation Generator */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardHeader>
          <CardTitle className="text-lg">Bisociation Generator</CardTitle>
          <p className="text-sm text-zinc-500">
            Pair your strength with a maximum distance domain for novel insights
          </p>
        </CardHeader>
        <CardContent>
          {pair && pairDisplay ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Anchor Domain */}
                <Link
                  href={`/domains/${pair.anchor.domain_id}`}
                  className="p-4 bg-white dark:bg-zinc-900 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                    Your Strength
                  </div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {pair.anchor.name}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {pair.anchor.domain_id} · {pair.anchor.books_read} books
                  </div>
                </Link>

                {/* Distant Domain */}
                <Link
                  href={`/domains/${pair.distant.domain_id}`}
                  className="p-4 bg-white dark:bg-zinc-900 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="text-xs text-pink-600 dark:text-pink-400 font-medium mb-1">
                    Distant Domain
                  </div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {pair.distant.name}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {pair.distant.domain_id} · Distance: {pair.distance}
                  </div>
                </Link>
              </div>

              {/* Synthesis Prompts */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg">
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Synthesis Prompts
                </div>
                <div className="space-y-2">
                  {pair.synthesis_prompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className="text-sm text-zinc-500 italic">
                {pair.reason}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href={`/domains/${pair.anchor.domain_id}`}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                  Explore Anchor
                </Link>
                <Link
                  href={`/domains/${pair.distant.domain_id}`}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors text-center"
                >
                  Explore Distant
                </Link>
              </div>

              {/* Refresh hint */}
              <p className="text-xs text-zinc-400 text-center">
                Refresh the page for a new pairing
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-500">
                Start reading more domains to generate bisociation pairings!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Known Isomorphisms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Known Isomorphisms</CardTitle>
          <p className="text-sm text-zinc-500">
            Concepts that appear across multiple domains under different names
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {KNOWN_ISOMORPHISMS.map((iso) => (
              <div
                key={iso.concept}
                className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                    {iso.concept}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {iso.domains.length} domains
                  </Badge>
                </div>
                <div className="space-y-2">
                  {iso.domains.map((domain) => (
                    <Link
                      key={domain.domain_id}
                      href={`/domains/${domain.domain_id}`}
                      className="flex items-start justify-between p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-zinc-400 text-sm mr-2">
                          {domain.domain_id}
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {domain.name}
                        </span>
                        <p className="text-sm text-zinc-500 mt-0.5">
                          {domain.manifestation}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
