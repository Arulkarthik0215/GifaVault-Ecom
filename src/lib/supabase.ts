import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Product Types ────────────────────────────────────────────────────────────

export type ProductCategory = 'hotwheels' | 'premium' | 'sets' | 'matchbox';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: ProductCategory;
    description: string;
    image_url: string;
    featured: boolean;
    new: boolean;
    in_stock: boolean;
    created_at: string;
}

// ─── Product API Helpers ──────────────────────────────────────────────────────

export const getAllProducts = async (category?: ProductCategory | 'all', search?: string) => {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    if (search && search.trim()) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
};

export const getProductById = async (id: string) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as Product;
};

export const getFeaturedProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
    if (error) throw error;
    return data as Product[];
};

export const deleteProduct = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
};

export const insertProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) throw error;
    return data as Product;
};

export const updateProduct = async (id: number, updates: Partial<Omit<Product, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Product;
};

// ─── Image Storage Helpers ────────────────────────────────────────────────────

export const uploadProductImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) throw error;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
};

export const deleteProductImage = async (imageUrl: string) => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;
    await supabase.storage.from('product-images').remove([fileName]);
};
