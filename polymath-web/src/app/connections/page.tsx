import { getAllDomains, getConfig, getInsights } from '@/lib/supabase';
import { generatePairing, formatPairingForDisplay } from '@/lib/bisociation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SaveInsightButton } from '@/components/save-insight-button';
import Link from 'next/link';

export const revalidate = 0;

export default async function ConnectionsPage() {
  const [domains, config, insights] = await Promise.all([
    getAllDomains(),
    getConfig(),
    getInsights(20),
  ]);

  // Generate bisociation pairing
  const pairing = generatePairing(
    domains,
    config?.expert_domains || [],
    3 // min distance
  );

  const display = pairing ? formatPairingForDisplay(pairing) : null;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Connections</h1>
      <p className="text-zinc-500 mb-6">
        Discover cross-domain insights through bisociation
      </p>

      <Tabs defaultValue="bisociation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bisociation">Bisociation</TabsTrigger>
          <TabsTrigger value="insights">Saved Insights ({insights.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="bisociation" className="space-y-6">
          {pairing && display ? (
            <>
              {/* Pairing Card */}
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">Bisociation Pair</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Anchor Domain */}
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      Your Strength
                    </p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {display.anchorInfo}
                    </p>
                  </div>

                  {/* Distance Badge */}
                  <div className="flex justify-center">
                    <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      Distance: {display.distanceDisplay}
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
                  <CardTitle>Synthesis Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      {display.mainPrompt}
                    </p>
                  </div>

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

                  <div className="pt-4 border-t flex items-center justify-between">
                    <p className="text-sm text-zinc-500">Had an insight? Save it for later.</p>
                    <SaveInsightButton
                      domainA={pairing.anchor.domain_id}
                      domainB={pairing.distant.domain_id}
                      domainAName={pairing.anchor.name}
                      domainBName={pairing.distant.name}
                      prompts={[display.mainPrompt, ...display.additionalPrompts]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Regenerate */}
              <div className="text-center">
                <Link
                  href="/connections"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-2 text-white font-medium hover:bg-purple-700 transition-colors"
                >
                  Generate New Pair
                </Link>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-zinc-500">Could not generate a pairing.</p>
                <p className="text-sm text-zinc-400 mt-2">
                  Try reading more domains first to unlock bisociation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-zinc-500">No saved insights yet.</p>
                <p className="text-sm text-zinc-400 mt-2">
                  Generate bisociation pairs and save your discoveries.
                </p>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{insight.domain_a}</Badge>
                    <span className="text-zinc-400">+</span>
                    <Badge variant="outline">{insight.domain_b}</Badge>
                    <span className="ml-auto text-xs text-zinc-400">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">{insight.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
