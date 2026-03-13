import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Category Types ───────────────────────────────────────────────────────────

export interface Category {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    sort_order: number;
    created_at: string;
}

// ─── Product Types ────────────────────────────────────────────────────────────

export type ProductCategory = string;

export interface Product {
    id: number;
    name: string;
    price: number;
    category: ProductCategory;
    description: string;
    image_url: string;
    additional_images: string[];
    featured: boolean;
    new: boolean;
    in_stock: boolean;
    created_at: string;
}

// ─── Category API Helpers ─────────────────────────────────────────────────────

export const getAllCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as Category[];
};

export const insertCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) throw error;
    return data as Category;
};

export const updateCategory = async (id: number, updates: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Category;
};

export const deleteCategory = async (id: number) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
};

export const uploadCategoryImage = async (file: File): Promise<string> => {
    const fileName = `cat-${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
    const { error } = await supabase.storage.from('site-images').upload(fileName, file, {
        contentType: 'image/webp',
    });
    if (error) throw error;
    const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
    return data.publicUrl;
};

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
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file, {
        contentType: 'image/webp',
    });
    if (error) throw error;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
};

export const deleteProductImage = async (imageUrl: string) => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;
    await supabase.storage.from('product-images').remove([fileName]);
};

// ─── Site Content (CMS) Types ─────────────────────────────────────────────────

export interface SiteContent {
    id: number;
    key: string;
    value: string;
    section: string;
    content_type: 'text' | 'image';
}

// ─── Site Content API Helpers ─────────────────────────────────────────────────

export const getSiteContent = async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase
        .from('site_content')
        .select('*');
    if (error) throw error;
    const map: Record<string, string> = {};
    (data as SiteContent[]).forEach((item) => {
        map[item.key] = item.value;
    });
    return map;
};

export const getAllSiteContentRows = async (): Promise<SiteContent[]> => {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true });
    if (error) throw error;
    return data as SiteContent[];
};

export const updateSiteContent = async (key: string, value: string) => {
    const { error } = await supabase
        .from('site_content')
        .update({ value })
        .eq('key', key);
    if (error) throw error;
};

export const upsertSiteContent = async (
    key: string,
    value: string,
    section: string,
    content_type: 'text' | 'image' = 'text'
) => {
    const { error } = await supabase
        .from('site_content')
        .upsert({ key, value, section, content_type }, { onConflict: 'key' });
    if (error) throw error;
};

// ─── Site Image Storage Helpers ───────────────────────────────────────────────

export const uploadSiteImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
    const { error } = await supabase.storage.from('site-images').upload(fileName, file, {
        contentType: 'image/webp',
    });
    if (error) throw error;
    const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
    return data.publicUrl;
};

export const deleteSiteImage = async (imageUrl: string) => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;
    await supabase.storage.from('site-images').remove([fileName]);
};
