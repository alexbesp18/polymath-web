import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBranchDistance, getBranchName } from '@/lib/distance';
import { getDistanceColor, DISTANCE_LABELS } from '@/lib/constants';

export const metadata = {
  title: 'Distance Matrix - Polymath Engine',
};

export default function DistanceMatrix() {
  // Generate 15x15 matrix
  const branches = Array.from({ length: 15 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Branch Distance Matrix</h1>
        <p className="text-zinc-500 mb-6">
          Conceptual distance between 15 knowledge branches (0-4 scale)
        </p>

        {/* Legend */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {[0, 1, 2, 3, 4].map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded ${getDistanceColor(d)} flex items-center justify-center text-xs font-bold`}
                  >
                    {d}
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {DISTANCE_LABELS[d]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>15×15 Distance Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-1 text-xs"></th>
                    {branches.map((b) => (
                      <th key={b} className="p-1 text-xs font-mono text-zinc-500">
                        {b}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {branches.map((row) => (
                    <tr key={row}>
                      <td className="p-1 text-xs font-mono text-zinc-500 text-right pr-2">
                        {row}
                      </td>
                      {branches.map((col) => {
                        const distance = getBranchDistance(row, col);
                        return (
                          <td key={col} className="p-0.5">
                            <div
                              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-help ${getDistanceColor(
                                distance
                              )}`}
                              title={`${getBranchName(row)} ↔ ${getBranchName(col)}: Distance ${distance}`}
                            >
                              {distance}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Branch Names Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Branch Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {branches.map((b) => (
                <div key={b} className="text-sm">
                  <span className="font-mono text-zinc-400">{b}</span>{' '}
                  <span className="font-medium">{getBranchName(b)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
  );
}
