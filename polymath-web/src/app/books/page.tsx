import { getBooks, getAllDomains } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BRANCH_NAMES } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Books - Polymath Engine',
};

export default async function BooksPage() {
  const [books, domains] = await Promise.all([
    getBooks(),
    getAllDomains(),
  ]);

  // Create domain lookup
  const domainMap = new Map(domains.map((d) => [d.domain_id, d]));

  // Group books by domain
  const booksByDomain = new Map<string, typeof books>();
  for (const book of books) {
    const current = booksByDomain.get(book.domain_id) || [];
    current.push(book);
    booksByDomain.set(book.domain_id, current);
  }

  // Sort domains by number of books (descending)
  const sortedDomains = Array.from(booksByDomain.entries()).sort(
    ([, a], [, b]) => b.length - a.length
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Book Library</h1>
      <p className="text-zinc-500 mb-6">
        {books.length} books across {booksByDomain.size} domains
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold">{books.length}</div>
            <p className="text-sm text-zinc-500">Total Books</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold">{booksByDomain.size}</div>
            <p className="text-sm text-zinc-500">Domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold">
              {books.length > 0 ? (books.length / booksByDomain.size).toFixed(1) : 0}
            </div>
            <p className="text-sm text-zinc-500">Avg per Domain</p>
          </CardContent>
        </Card>
      </div>

      {/* Books by Domain */}
      {books.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-zinc-500">No books logged yet.</p>
            <Link href="/log" className="text-blue-600 hover:underline mt-2 inline-block">
              Log your first reading session →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDomains.map(([domainId, domainBooks]) => {
            const domain = domainMap.get(domainId);
            const branchName = domain ? BRANCH_NAMES[domain.branch_id] : 'Unknown';

            return (
              <Card key={domainId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/domains/${domainId}`}
                        className="hover:text-blue-600"
                      >
                        <CardTitle className="text-lg">
                          {domainId} — {domain?.name || 'Unknown'}
                        </CardTitle>
                      </Link>
                      <p className="text-sm text-zinc-500">{branchName}</p>
                    </div>
                    <Badge variant="outline">{domainBooks.length} books</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {domainBooks.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{book.title}</p>
                          {book.author && (
                            <p className="text-sm text-zinc-500">{book.author}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          {book.function_slot && (
                            <Badge variant="outline" className="text-xs">
                              {book.function_slot}
                            </Badge>
                          )}
                          {book.pages && <span>{book.pages}p</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
