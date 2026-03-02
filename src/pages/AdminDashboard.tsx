import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, LogOut, Trash2, Edit2, X, Upload, CheckCircle,
    AlertCircle, Package, Loader2, Image as ImageIcon
} from 'lucide-react';
import {
    supabase, getAllProducts, insertProduct, deleteProduct,
    updateProduct, uploadProductImage, deleteProductImage,
    Product, ProductCategory
} from '@/lib/supabase';
import { compressImage } from '@/lib/imageUtils';

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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            // Fallback to original file if compression fails
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

            // Upload new image if selected
            if (imageFile) {
                image_url = await uploadProductImage(imageFile);
                // Delete old image if editing
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
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === 'success'
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
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {products.length} products
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            id="add-product-btn"
                            onClick={openAddForm}
                            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
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
            </header>

            {/* Product Table */}
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
