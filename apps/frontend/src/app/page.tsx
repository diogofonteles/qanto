import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-primary">qanto</h1>
        <p className="text-2xl text-gray-700 mb-8">
          Compare prices across supermarkets and save money on your shopping
        </p>
        <p className="text-lg text-gray-600 mb-12">
          Create shopping lists, compare prices in real-time, and find the best deals near you.
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Register as Consumer
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          Are you a supermarket?{' '}
          <Link href="/register/supermarket" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
