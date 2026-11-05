import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
            <div className="max-w-2xl text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm border">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Bienvenue sur MyStore 🛍️
                </h1>
                
                <p className="text-gray-600 text-lg">
                    Découvrez notre application e-commerce full-stack construite avec un back-end **Symfony** et un front-end **Next.js**. 
                </p>

                <div className="pt-4">
                    {/* Le composant Link de Next.js permet une navigation fluide côté client*/}
                    <Link
                        href="/products"
                        className="inline-block bg-blue-600 text-white font-medium px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition"
                    >
                        Accéder au catalogue des produits
                    </Link>
                </div>
            </div>
        </main>
    );
}