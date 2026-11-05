'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/axios";
import Link from "next/link";

function EditProductContent() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    // state pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
    });

    const [loading, setloading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!productId) return;

        const axiosProduct = async () => {
            try {
                const response = await api.get('/products');
                const product = response.data.find((p: any) => p.id.toString() === productId);

                if (product) {
                    setFormData({
                        name: product.name,
                        description: product.description || '',
                        price: product.price.toString(),
                        stock: product.stock.toString(),
                        imageUrl: product.imageUrl || '',
                    });
                } else {
                    setError('Produit introuvable.');
                }
            } catch (error) {
                console.error(error);
                setError('Erreur lors du chargement du produit.');
            } finally {
                setloading(false);
            }
        };
        axiosProduct();
    }, [productId]);

    // Gestion des changements dans les inputs du formulaire
    //Fonction unique pour gérer la saisie de tous les champs du formulaire (input et textarea)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData, // copie de l'ancien état du formulaire
            [e.target.name]: e.target.value // on met à jour la propriété ciblée par son attribut 'name'
        });
    };

    // 2. Soumission du formulaire de mise à jour
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // Envoi de la requête PUT vers ton API Symfony
            // Côté Symfony, le contrôleur intercepte PUT /api/products/{id}
            await api.put(`/products/${productId}`, {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
                imageUrl: formData.imageUrl || null,
            });

            // Redirection vers la liste des produits après succès
            router.push('/products');
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la mise à jour du produit.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Chargement...</p>;

    return (
        <main className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">

            {/* Lien de retour vers le catalogue */}
            <div className="mb-4">
                <Link 
                href="/products" 
                className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center gap-1"
                >
                    ← Retour au catalogue
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">URL de l'image (optionnel)</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {submitting ? 'Modification...' : 'Enregistrer les modifications'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/products')}
                        className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 transition"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </main>
    );
}

export default function UpdateProductPage() {

    //En utilisant <Suspense>, tu dis à Next.js : "Afficher un fallback (un message de chargement) 
    // le temps que les paramètres de l'URL soient disponibles pour le composant client".
    // Cela lève le blocage du prerender.

    return (
        <Suspense fallback={<div className="text-center mt-10">Chargement de la page...</div>}>
            <EditProductContent/>
        </Suspense>
    )
}