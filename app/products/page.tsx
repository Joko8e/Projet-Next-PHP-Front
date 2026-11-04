'use client'; // Indique à Next.js qu'il s'agit d'un composant client (nécessaire pour utiliser useEffect, useState et gérer des clics)

import { useEffect, useState, } from "react";
import { api } from "@/lib/axios";
import Link from "next/link";



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



// Composant de la page
export default function ProductsPage() {

  // 1. Déclaration d'un state  local pour stocker la liste des produits
  const [products, setProducts] = useState<Product[]>([]); // État pour stocker la liste des produits (initialisé à un tableau vide)
  const [loading, setLoading] = useState<boolean>(true); // État pour gérer l'indicateur de chargement (vrai par défaut au montage du composant)
  const [error, setError] = useState<string>(''); // État pour stocker un éventuel message d'erreur (vide par défaut)

  // 2. Fonction pour récupérer les produits depuis l'API Symfony via Axios
  const axiosProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products');
      setProducts(response.data); // on met à jour le state avec les données reçues
    } catch (error) {
      console.error('Erreur axios:', error);
      setError('Erreur lors de la récupération des produits')
    } finally {
      setLoading(false) // Qu'il y ait une erreur ou no, on arrête le chargement 
    }
  };
  
  // 3.useEffect s'exécute une seule fois au chargement du composant pour aller chercher les données
  useEffect(() => {
    axiosProducts();
  }, []);

  // 4. fonction pour gérer la suppression d'un produit
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes=vous sûr de vouloir supprimer ce produit')) {
      return;
    }
    try {
      // appel DELETE vers l'API Symfony
      await api.delete(`/products/${id}`);

      // Mise à jour instante du state : on filtre le produit supprimé
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression du produit.');
    }
  };

  // Affichage conditionnel pendant le chargement ou en cas d'erreur
  if (loading) return <p className="text-center mt-10">Chargement des produits...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <main className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Catalogue de la Boutique</h1>
                <Link 
                    href="/products/new" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Ajouter un produit
                </Link>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500">Aucun produit pour le moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                <p className="text-gray-600 text-sm mb-4">{product.description || 'Pas de description'}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-bold text-blue-600">{product.price} €</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Stock : {product.stock}</span>
                                </div>
                            </div>

                        <div className="flex gap-2 mt-4">
                          <Link href={`/products/${product.id}/edit`} className="flex-1 bg-amber-500 text-white py-2 rounded text-center hover:bg-amber-600 transition text-sm font-medium">
                            Modifier</Link>
                          
                          {/* Bouton de suppression */}
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm font-medium"
                            >
                                Supprimer
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
  );
}
