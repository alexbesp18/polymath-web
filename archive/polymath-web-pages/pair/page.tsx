import { getAllDomains, getConfig } from '@/lib/supabase';
import { generatePairing, formatPairingForDisplay } from '@/lib/bisociation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const revalidate = 0; // Always fresh

export default async function BisociationPairing() {
  const [domains, config] = await Promise.all([
    getAllDomains(),
    getConfig(),
  ]);

  // Generate pairing
  const pairing = generatePairing(
    domains,
    config?.expert_domains || [],
    3 // min distance
  );

  if (!pairing) {
    return (
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-zinc-500">Could not generate a pairing.</p>
              <p className="text-sm text-zinc-400 mt-2">Try reading more domains first.</p>
            </CardContent>
          </Card>
        </main>
    );
  }

  const display = formatPairingForDisplay(pairing);

  return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 border-purple-200 dark:border-purple-800 mb-6">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">🎲</div>
            <CardTitle className="text-2xl">Bisociation Pairing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Anchor Domain */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Anchor (Your Strength)
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {display.anchorInfo}
              </p>
              <p className="text-sm text-zinc-500">
                Books read: {pairing.anchor.books_read}
              </p>
            </div>

            {/* Distance Badge */}
            <div className="flex justify-center">
              <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                Conceptual Distance: {display.distanceDisplay}
              </Badge>
            </div>

            {/* Distant Domain */}
            <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                Distant Domain
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {display.distantInfo}
              </p>
              <p className="text-sm text-zinc-500">
                Books read: {pairing.distant.books_read}
                {pairing.distant.status === 'untouched' && ' (unexplored)'}
              </p>
            </div>

            {/* Reason */}
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
              <p className="text-sm font-medium text-zinc-500 mb-1">Why paired?</p>
              <p className="text-zinc-700 dark:text-zinc-300">{pairing.reason}</p>
            </div>
          </CardContent>
        </Card>

        {/* Synthesis Prompts */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <CardTitle>Synthesis Prompts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Prompt */}
            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {display.mainPrompt}
              </p>
            </div>

            {/* Additional Prompts */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500">Additional questions:</p>
              <ol className="list-decimal list-inside space-y-2">
                {display.additionalPrompts.map((prompt, i) => (
                  <li key={i} className="text-zinc-700 dark:text-zinc-300">
                    {prompt}
                  </li>
                ))}
              </ol>
            </div>

            {/* Usage Note */}
            <div className="text-sm text-zinc-500 pt-4 border-t">
              Use these prompts during or after reading to force connections.
              Capture insights in your daily log or isomorphism notes.
            </div>
          </CardContent>
        </Card>

        {/* Regenerate */}
        <div className="mt-8 text-center">
          <Link
            href="/pair"
            className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-2 text-white font-medium hover:bg-purple-700 transition-colors"
          >
            Generate New Pairing
          </Link>
        </div>
      </main>
  );
}
