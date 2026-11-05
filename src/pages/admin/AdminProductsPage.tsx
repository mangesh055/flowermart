import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Flower2,
  Search,
  Check,
  X,
  Sparkles,
  Camera,
  AlertCircle,
} from 'lucide-react'
import { productService, INITIAL_PRODUCTS } from '@/services/productService'
import { categoryService, INITIAL_CATEGORIES } from '@/services/categoryService'
import type { Product, Category, PriceUnit } from '@/types/database'
import { formatINR, formatPriceUnit, cn } from '@/lib/utils'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [nameMarathi, setNameMarathi] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState<number>(500)
  const [priceUnit, setPriceUnit] = useState<PriceUnit>('per_piece')
  const [flowerType, setFlowerType] = useState('')
  const [occasion, setOccasion] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const loadData = () => {
    productService.getAll().then(setProducts)
    categoryService.getAll().then((cats) => {
      setCategories(cats)
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id)
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAddModal = () => {
    setEditingProduct(null)
    setName('')
    setNameMarathi('')
    setCategoryId(categories[0]?.id || 'cat-1')
    setSku(`SPB-${Math.floor(100 + Math.random() * 900)}`)
    setPrice(500)
    setPriceUnit('per_piece')
    setFlowerType('Fresh Roses & Jasmine')
    setOccasion('Wedding / Pooja')
    setDescription('')
    setImageUrl('https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80')
    setIsAvailable(true)
    setIsFeatured(false)
    setIsModalOpen(true)
  }

  const openEditModal = (p: Product) => {
    setEditingProduct(p)
    setName(p.name)
    setNameMarathi(p.name_marathi || '')
    setCategoryId(p.category_id)
    setSku(p.sku || '')
    setPrice(p.price)
    setPriceUnit(p.price_unit)
    setFlowerType(p.flower_type || '')
    setOccasion(p.occasion || '')
    setDescription(p.description || '')
    setImageUrl(p.primary_image_url || '')
    setIsAvailable(p.is_available)
    setIsFeatured(p.is_featured)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      name_marathi: nameMarathi.trim() || undefined,
      slug: name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      category_id: categoryId,
      sku: sku.trim() || undefined,
      price: Number(price),
      price_unit: priceUnit,
      flower_type: flowerType.trim() || undefined,
      occasion: occasion.trim() || undefined,
      description: description.trim() || undefined,
      primary_image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
      is_available: isAvailable,
      is_featured: isFeatured,
      display_order: editingProduct ? editingProduct.display_order : products.length + 1,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)))
    } else {
      setProducts([productData, ...products])
    }

    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this garland product from the catalogue?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.flower_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Inventory & Offerings
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create, update garland prices, photos, flower varieties and stock availability
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-saffron text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garland</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl p-4 border border-cream shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by garland title, flower, or SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
          />
        </div>
        <span className="text-xs text-muted-foreground font-semibold">
          {filteredProducts.length} Items Listed
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-ivory text-muted-foreground uppercase text-[11px] font-semibold border-b border-cream">
              <tr>
                <th className="py-3 px-4">Garland Photo & Title</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price & Unit</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/60">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id)
                return (
                  <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primary_image_url}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-cream shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-brown">{p.name}</p>
                          {p.name_marathi && (
                            <p className="font-marathi text-xs text-rose">{p.name_marathi}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-muted-foreground">
                      {p.sku || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-bold text-brown">
                      {formatINR(p.price)}
                      <span className="text-[11px] font-normal text-muted-foreground block">
                        {formatPriceUnit(p.price_unit)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brown font-medium">
                      {cat?.name || 'Traditional'}
                    </td>
                    <td className="py-3 px-4">
                      {p.is_featured ? (
                        <span className="badge-tag bg-saffron text-white text-[10px]">
                          Featured
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'badge-tag text-[10px]',
                          p.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}
                      >
                        {p.is_available ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-cream text-brown"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-rose/10 text-rose"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-cream shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-cream pb-3">
              <h2 className="font-display font-bold text-xl text-brown">
                {editingProduct ? 'Edit Garland Product' : 'Add New Garland to Catalogue'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-brown"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-brown">Product Name (English)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Red Rose Varmala"
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brown">Product Name (Marathi)</label>
                  <input
                    type="text"
                    value={nameMarathi}
                    onChange={(e) => setNameMarathi(e.target.value)}
                    placeholder="e.g. शाही लाल गुलाब वरमाला"
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-marathi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brown">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brown">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brown">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brown">Price Unit</label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
                  >
                    <option value="per_piece">Per Piece</option>
                    <option value="per_pair">Per Pair (Varmala)</option>
                    <option value="per_metre">Per Metre (Strands)</option>
                    <option value="per_set">Per Set (Car/Decor)</option>
                    <option value="per_kg">Per Kg (Loose)</option>
                    <option value="custom_quotation">Custom Quotation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brown">Flower Varieties</label>
                  <input
                    type="text"
                    value={flowerType}
                    onChange={(e) => setFlowerType(e.target.value)}
                    placeholder="e.g. Dutch Roses, Baby's Breath"
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-brown">Occasion</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Wedding, Reception, Daily Pooja"
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-brown">Product Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-brown">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm resize-none"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brown cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-saffron accent-saffron"
                    />
                    <span>Available in Stock</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brown cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-saffron accent-saffron"
                    />
                    <span>Show in Featured Section</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-cream">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brown border border-cream hover:bg-cream"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-saffron text-xs py-2 px-5">
                  Save Garland
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

