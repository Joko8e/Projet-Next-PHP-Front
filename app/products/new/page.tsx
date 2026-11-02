'use client'; // car on utilise des état des react (useState) et des interractions utilisateurs

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export default function NewProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // On envoie les données en POST vers notre API Symfony
            // On convertit price et stock en nombres (number) pour que Doctrine les accepte bien
            await api.post('/products', {
                // FormData me permet d'envoyer un fichier car le forma JSON ne suffit pas
                // On garde le nom tel quel (texte)
                name: formData.name,
    
                // On garde la description telle quelle
                description: formData.description,
    
                // Conversion du prix (string -> nombre décimal)
                price: parseFloat(formData.price),
    
                // Conversion du stock (string -> nombre entier en base 10)
                stock: parseInt(formData.stock, 10),
    
                // Si l'URL de l'image est vide ou absente, on envoie explicitement 'null'
                imageUrl: formData.imageUrl || null
            })

            // Une fois l'action (création/modification) réussie :
            // 1. On redirige l'utilisateur vers la page du catalogue des produits
            router.push('/products');
            
            // 2. On force le rafraîchissement des données pour s'assurer 
            // que la page cible affiche bien les dernières modifications (évite le cache)
            router.refresh(); 
        } catch (error:any) {
            console.error("Détails complets de l'erreur Axios :", error.response?.data);
            
            // Si Symfony renvoie un message d'erreur précis, on l'affiche
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Une erreur est survenue lors de la création du produit';
            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }


    
    return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h1>
      
        {/* Si une erreur est présente, on affiche un encadré rouge stylisé avec le message */}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Création en cours...' : 'Créer le produit'}
        </button>
      </form>
    </main>
  );
}