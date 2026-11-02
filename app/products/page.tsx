import { api } from "@/lib/axios";



// Interface Typescript pour typer les produits 
interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    category: string | null;
}

// Fonction pour récupérer les produits avec Axios
async function getProducts(): Promise<Product[]> {
    try {
        // On utilise notre instance 'api' (équivalent de api.get('/products'))
        const response = await api.get<Product[]>('/products');
        return response.data; // Avec Axios, les données JSON sont directement dans .data
    } catch (error) {
        console.error('Erreur Axios:', error);
        throw new Error('Erreur lors de la récupération des produits');
    }
}

// Composant de la page
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Catalogue de la Boutique (via Axios)</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Aucun produit pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{product.description || 'Pas de description'}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">{product.price} €</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Stock : {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
