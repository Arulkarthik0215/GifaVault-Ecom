import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, LogOut, Trash2, Edit2, X, Upload, CheckCircle,
    AlertCircle, Package, Loader2, Image as ImageIcon, Settings, Save
} from 'lucide-react';
import {
    supabase, getAllProducts, insertProduct, deleteProduct,
    updateProduct, uploadProductImage, deleteProductImage,
    Product, ProductCategory,
    getAllSiteContentRows, upsertSiteContent, uploadSiteImage, deleteSiteImage,
    SiteContent
} from '@/lib/supabase';
import { compressImage } from '@/lib/imageUtils';
import { useSiteContent } from '@/components/SiteContentContext';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
    { value: 'hotwheels', label: 'Hot Wheels' },
    { value: 'premium', label: 'Premium' },
    { value: 'sets', label: 'Sets' },
    { value: 'matchbox', label: 'Matchbox' },
];

const emptyForm = {
    name: '',
    price: '',
    category: 'hotwheels' as ProductCategory,
    description: '',
    featured: false,
    new: false,
    in_stock: true,
};

// ─── Content definition: all CMS keys grouped by section ─────────────────────
interface ContentFieldDef {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
    placeholder?: string;
}

interface ContentSectionDef {
    section: string;
    label: string;
    fields: ContentFieldDef[];
}

const CONTENT_SECTIONS: ContentSectionDef[] = [
    {
        section: 'hero',
        label: '🏠 Hero Section',
        fields: [
            { key: 'hero_subtitle', label: 'Welcome Text', type: 'text', placeholder: 'Welcome to GIFA Vault' },
            { key: 'hero_heading', label: 'Main Heading (use \\n for line breaks)', type: 'textarea', placeholder: 'Curated Collectibles\nfor the Modern\nEnthusiast' },
            { key: 'hero_description', label: 'Description', type: 'textarea', placeholder: 'Discover rare Hot Wheels, premium die-cast models...' },
            { key: 'hero_background_image', label: 'Background Image', type: 'image' },
            { key: 'hero_cta_primary', label: 'Primary Button Text', type: 'text', placeholder: 'Explore Collection' },
            { key: 'hero_cta_secondary', label: 'Secondary Button Text', type: 'text', placeholder: 'Follow Us' },
        ],
    },
    {
        section: 'trust_bar',
        label: '✅ Trust Bar',
        fields: [
            { key: 'trust_item_1_title', label: 'Item 1 Title', type: 'text', placeholder: 'Authentic Products' },
            { key: 'trust_item_1_description', label: 'Item 1 Description', type: 'text', placeholder: '100% genuine collectibles' },
            { key: 'trust_item_2_title', label: 'Item 2 Title', type: 'text', placeholder: 'Safe Delivery' },
            { key: 'trust_item_2_description', label: 'Item 2 Description', type: 'text', placeholder: 'Carefully packed & shipped' },
            { key: 'trust_item_3_title', label: 'Item 3 Title', type: 'text', placeholder: 'Premium Selection' },
            { key: 'trust_item_3_description', label: 'Item 3 Description', type: 'text', placeholder: 'Hand-picked rare finds' },
        ],
    },
    {
        section: 'categories',
        label: '📁 Categories Section',
        fields: [
            { key: 'categories_subtitle', label: 'Section Subtitle', type: 'text', placeholder: 'Browse By Category' },
            { key: 'categories_heading', label: 'Section Heading', type: 'text', placeholder: 'Explore Our Collection' },
            { key: 'category_hotwheels_image', label: 'Hot Wheels Card Image', type: 'image' },
            { key: 'category_premium_image', label: 'Premium Card Image', type: 'image' },
            { key: 'category_sets_image', label: 'Sets Card Image', type: 'image' },
            { key: 'category_matchbox_image', label: 'Matchbox Card Image', type: 'image' },
        ],
    },
    {
        section: 'featured',
        label: '⭐ Featured Products Section',
        fields: [
            { key: 'featured_subtitle', label: 'Section Subtitle', type: 'text', placeholder: 'Featured' },
            { key: 'featured_heading', label: 'Section Heading', type: 'text', placeholder: 'Top Picks from The Vault' },
        ],
    },
    {
        section: 'social',
        label: '📱 Social Proof Section',
        fields: [
            { key: 'social_heading', label: 'Heading', type: 'text', placeholder: 'Join Our Community' },
            { key: 'social_description', label: 'Description', type: 'textarea', placeholder: 'Follow us on Instagram for new arrivals...' },
        ],
    },
    {
        section: 'product_detail',
        label: '🏷️ Product Detail Page',
        fields: [
            { key: 'trust_badge_1', label: 'Trust Badge 1', type: 'text', placeholder: '100% Authentic Product' },
            { key: 'trust_badge_2', label: 'Trust Badge 2', type: 'text', placeholder: 'Quality Guaranteed' },
            { key: 'trust_badge_3', label: 'Trust Badge 3', type: 'text', placeholder: 'Safe & Secure Packaging' },
            { key: 'related_products_heading', label: 'Related Products Heading', type: 'text', placeholder: 'You May Also Like' },
        ],
    },
    {
        section: 'global',
        label: '🌐 Global (Header / Footer / Social)',
        fields: [
            { key: 'instagram_url', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/gifavault' },
            { key: 'instagram_handle', label: 'Instagram Handle', type: 'text', placeholder: '@gifavault' },
            { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'contact@gifavault.com' },
            { key: 'footer_tagline', label: 'Footer Tagline', type: 'textarea', placeholder: 'Curated collectibles for the modern enthusiast...' },
        ],
    },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Tab state ────────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<'products' | 'content'>('products');

    // ─── Product state ────────────────────────────────────────────────────────────
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [compressedSize, setCompressedSize] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ─── Site Content state ───────────────────────────────────────────────────────
    const [contentValues, setContentValues] = useState<Record<string, string>>({});
    const [contentLoading, setContentLoading] = useState(false);
    const [savingSection, setSavingSection] = useState<string | null>(null);
    const [contentImageUploading, setContentImageUploading] = useState<string | null>(null);
    const contentImageRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const { refreshContent } = useSiteContent();

    // ─── Toast ────────────────────────────────────────────────────────────────────
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // ─── Auth Check ─────────────────────────────────────────────────────────────
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) navigate('/admin');
        });
    }, [navigate]);

    // ─── Load Products ───────────────────────────────────────────────────────────
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch {
            showToast('Failed to load products.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    // ─── Load Site Content ────────────────────────────────────────────────────────
    const loadSiteContent = async () => {
        setContentLoading(true);
        try {
            const rows = await getAllSiteContentRows();
            const map: Record<string, string> = {};
            rows.forEach((r: SiteContent) => { map[r.key] = r.value; });
            setContentValues(map);
        } catch {
            showToast('Failed to load site content.', 'error');
        } finally {
            setContentLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'content') loadSiteContent();
    }, [activeTab]);

    // ─── Toast ───────────────────────────────────────────────────────────────────
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ─── Image Handling (with compression) ─────────────────────────────────────
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file);
            setImageFile(compressed);
            setImagePreview(URL.createObjectURL(compressed));
            const sizeKB = (compressed.size / 1024).toFixed(0);
            setCompressedSize(`${sizeKB} KB`);
        } catch {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setCompressedSize('');
        }
    };

    // ─── Open Form ────────────────────────────────────────────────────────────────
    const openAddForm = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
        setCompressedSize('');
        setShowForm(true);
    };

    const openEditForm = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            price: String(product.price),
            category: product.category,
            description: product.description || '',
            featured: product.featured,
            new: product.new,
            in_stock: product.in_stock,
        });
        setImageFile(null);
        setImagePreview(product.image_url || '');
        setCompressedSize('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    // ─── Save Product ─────────────────────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let image_url = editingProduct?.image_url || '';

            if (imageFile) {
                image_url = await uploadProductImage(imageFile);
                if (editingProduct?.image_url) {
                    await deleteProductImage(editingProduct.image_url);
                }
            }

            const productData = {
                name: form.name,
                price: parseFloat(form.price),
                category: form.category,
                description: form.description,
                image_url,
                featured: form.featured,
                new: form.new,
                in_stock: form.in_stock,
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                showToast('Product updated successfully!', 'success');
            } else {
                await insertProduct(productData);
                showToast('Product added successfully!', 'success');
            }

            closeForm();
            loadProducts();
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'Something went wrong.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete Product ───────────────────────────────────────────────────────────
    const handleDelete = async (product: Product) => {
        if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
        setDeletingId(product.id);
        try {
            await deleteProduct(product.id);
            if (product.image_url) await deleteProductImage(product.image_url);
            showToast('Product deleted.', 'success');
            loadProducts();
        } catch {
            showToast('Failed to delete product.', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    // ─── Save Site Content Section ────────────────────────────────────────────────
    const handleSaveSection = async (sectionDef: ContentSectionDef) => {
        setSavingSection(sectionDef.section);
        try {
            for (const field of sectionDef.fields) {
                const value = contentValues[field.key];
                if (value !== undefined && value !== '') {
                    const contentType = field.type === 'image' ? 'image' : 'text';
                    await upsertSiteContent(field.key, value, sectionDef.section, contentType as 'text' | 'image');
                }
            }
            showToast(`${sectionDef.label} saved successfully!`, 'success');
            // Refresh the context so public pages see updated content
            await refreshContent();
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'Failed to save content.', 'error');
        } finally {
            setSavingSection(null);
        }
    };

    // ─── Handle Content Image Upload ──────────────────────────────────────────────
    const handleContentImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setContentImageUploading(key);
        try {
            const compressed = await compressImage(file);
            const url = await uploadSiteImage(compressed);
            setContentValues(prev => ({ ...prev, [key]: url }));
            showToast('Image uploaded!', 'success');
        } catch {
            showToast('Failed to upload image.', 'error');
        } finally {
            setContentImageUploading(null);
        }
    };

    // ─── Handle Content Image Delete ──────────────────────────────────────────────
    const [contentImageDeleting, setContentImageDeleting] = useState<string | null>(null);

    const handleContentImageDelete = async (key: string, section: string) => {
        if (!contentValues[key]) return;
        if (!confirm('Delete this image? The default image will be used instead.')) return;
        setContentImageDeleting(key);
        try {
            // Delete from storage
            await deleteSiteImage(contentValues[key]);
            // Clear the value locally
            setContentValues(prev => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
            // Remove from database so fallback kicks in
            await upsertSiteContent(key, '', section, 'image');
            await refreshContent();
            showToast('Image deleted. Default image will be used.', 'success');
        } catch {
            showToast('Failed to delete image.', 'error');
        } finally {
            setContentImageDeleting(null);
        }
    };

    // ─── Logout ───────────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === 'success'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-foreground" />
                        <span className="font-['Outfit'] font-semibold text-foreground">GifaVault Admin</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeTab === 'products' && (
                            <button
                                id="add-product-btn"
                                onClick={openAddForm}
                                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </button>
                        )}
                        <button
                            id="admin-logout-btn"
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-0 -mb-px">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'products'
                                ? 'border-foreground text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Products
                                <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">{products.length}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content'
                                ? 'border-foreground text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Site Content
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════ PRODUCTS TAB ═══════════════════════════ */}
            {activeTab === 'products' && (
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24">
                            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">No products yet. Add your first product!</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg bg-secondary flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                                                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-foreground leading-tight">{product.name}</p>
                                                        <div className="flex gap-1.5 mt-0.5">
                                                            {product.featured && (
                                                                <span className="text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 rounded">Featured</span>
                                                            )}
                                                            {product.new && (
                                                                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded">New</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground capitalize hidden sm:table-cell">
                                                {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium ${product.in_stock
                                                    ? 'bg-emerald-500/10 text-emerald-600'
                                                    : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 justify-end">
                                                    <button
                                                        onClick={() => openEditForm(product)}
                                                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        disabled={deletingId === product.id}
                                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        {deletingId === product.id
                                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            : <Trash2 className="w-3.5 h-3.5" />
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            )}

            {/* ═══════════════════════════ SITE CONTENT TAB ═══════════════════════ */}
            {activeTab === 'content' && (
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {contentLoading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="mb-4">
                                <h2 className="font-['Outfit'] text-xl font-semibold text-foreground">Edit Site Content</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Change any text or image on your website. Save each section individually.
                                </p>
                            </div>

                            {CONTENT_SECTIONS.map((sectionDef) => (
                                <div
                                    key={sectionDef.section}
                                    className="rounded-xl border border-border overflow-hidden bg-card"
                                >
                                    {/* Section Header */}
                                    <div className="px-5 py-4 bg-secondary/50 border-b border-border flex items-center justify-between">
                                        <h3 className="font-['Outfit'] font-semibold text-foreground text-sm">
                                            {sectionDef.label}
                                        </h3>
                                        <button
                                            onClick={() => handleSaveSection(sectionDef)}
                                            disabled={savingSection === sectionDef.section}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-60"
                                        >
                                            {savingSection === sectionDef.section ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Save className="w-3 h-3" />
                                            )}
                                            {savingSection === sectionDef.section ? 'Saving...' : 'Save Section'}
                                        </button>
                                    </div>

                                    {/* Fields */}
                                    <div className="px-5 py-4 space-y-4">
                                        {sectionDef.fields.map((field) => (
                                            <div key={field.key}>
                                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                                    {field.label}
                                                </label>

                                                {field.type === 'text' && (
                                                    <input
                                                        type="text"
                                                        value={contentValues[field.key] || ''}
                                                        onChange={(e) => setContentValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                        placeholder={field.placeholder}
                                                        className="w-full px-4 py-2.5 bg-secondary border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                )}

                                                {field.type === 'textarea' && (
                                                    <textarea
                                                        value={contentValues[field.key] || ''}
                                                        onChange={(e) => setContentValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                        placeholder={field.placeholder}
                                                        rows={3}
                                                        className="w-full px-4 py-2.5 bg-secondary border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                                    />
                                                )}

                                                {field.type === 'image' && (
                                                    <div className="flex items-center gap-4">
                                                        {/* Preview */}
                                                        <div className="w-24 h-24 rounded-lg bg-secondary border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                            {contentValues[field.key] ? (
                                                                <img
                                                                    src={contentValues[field.key]}
                                                                    alt={field.label}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        {/* Upload & Delete Buttons */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => contentImageRefs.current[field.key]?.click()}
                                                                    disabled={contentImageUploading === field.key}
                                                                    className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-60"
                                                                >
                                                                    {contentImageUploading === field.key ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Upload className="w-4 h-4" />
                                                                    )}
                                                                    {contentImageUploading === field.key ? 'Uploading...' : 'Upload Image'}
                                                                </button>
                                                                {contentValues[field.key] && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleContentImageDelete(field.key, sectionDef.section)}
                                                                        disabled={contentImageDeleting === field.key}
                                                                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-60"
                                                                    >
                                                                        {contentImageDeleting === field.key ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <Trash2 className="w-4 h-4" />
                                                                        )}
                                                                        {contentImageDeleting === field.key ? 'Deleting...' : 'Delete'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1.5">
                                                                PNG, JPG, WebP — auto-compressed
                                                            </p>
                                                            <input
                                                                ref={(el) => { contentImageRefs.current[field.key] = el; }}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleContentImageUpload(field.key, e)}
                                                                className="hidden"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            )}

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeForm}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl">
                                    <h2 className="font-['Outfit'] font-semibold text-foreground">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h2>
                                    <button onClick={closeForm} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSave} className="px-6 py-5 space-y-5">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Product Image</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-muted-foreground transition-colors"
                                            style={{ aspectRatio: '16/9' }}
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    {compressedSize && (
                                                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                                            {compressedSize}
                                                        </span>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Upload className="w-6 h-6 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground p-8">
                                                    <Upload className="w-8 h-8" />
                                                    <p className="text-sm font-medium">Click to upload image</p>
                                                    <p className="text-xs">PNG, JPG, WebP — auto-compressed to WebP</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label htmlFor="product-name" className="block text-sm font-medium text-foreground mb-1.5">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="product-name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="e.g. 1970 Dodge Charger R/T"
                                            className="w-full px-4 py-2.5 bg-secondary border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>

                                    {/* Price + Category Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="product-price" className="block text-sm font-medium text-foreground mb-1.5">
                                                Price (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="product-price"
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={form.price}
                                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                placeholder="e.g. 599"
                                                className="w-full px-4 py-2.5 bg-secondary border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="product-category" className="block text-sm font-medium text-foreground mb-1.5">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="product-category"
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                                                className="w-full px-4 py-2.5 bg-secondary border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                {CATEGORIES.map((c) => (
                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="product-description" className="block text-sm font-medium text-foreground mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            id="product-description"
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            placeholder="Describe the product..."
                                            rows={3}
                                            className="w-full px-4 py-2.5 bg-secondary border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex flex-col gap-3 pt-1">
                                        {[
                                            { key: 'featured', label: 'Featured', description: 'Show in Featured section on homepage' },
                                            { key: 'new', label: 'New Arrival', description: 'Mark as new arrival' },
                                            { key: 'in_stock', label: 'In Stock', description: 'Product is available to purchase' },
                                        ].map(({ key, label, description }) => (
                                            <label key={key} className="flex items-center justify-between cursor-pointer group">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{label}</p>
                                                    <p className="text-xs text-muted-foreground">{description}</p>
                                                </div>
                                                <div
                                                    onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                                                    className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ml-4 ${form[key as keyof typeof form] ? 'bg-foreground' : 'bg-secondary border border-border'
                                                        }`}
                                                    style={{ height: '22px', width: '40px' }}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? 'translate-x-5 bg-background' : 'translate-x-0.5'
                                                            }`}
                                                        style={{ backgroundColor: form[key as keyof typeof form] ? 'white' : undefined }}
                                                    />
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="flex-1 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            id="save-product-btn"
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
