import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FolderTree, X, Check } from 'lucide-react'
import { categoryService, INITIAL_CATEGORIES } from '@/services/categoryService'
import type { Category } from '@/types/database'
import { cn } from '@/lib/utils'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [nameMarathi, setNameMarathi] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    categoryService.getAll().then(setCategories)
  }, [])

  const openAddModal = () => {
    setEditingCategory(null)
    setName('')
    setNameMarathi('')
    setSlug('')
    setDescription('')
    setImageUrl('https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80')
    setDisplayOrder(categories.length + 1)
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat)
    setName(cat.name)
    setNameMarathi(cat.name_marathi || '')
    setSlug(cat.slug)
    setDescription(cat.description || '')
    setImageUrl(cat.image_url || '')
    setDisplayOrder(cat.display_order)
    setIsActive(cat.is_active)
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const categorySlug = slug.trim() || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')

    const catData: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: name.trim(),
      name_marathi: nameMarathi.trim() || undefined,
      slug: categorySlug,
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
      display_order: Number(displayOrder),
      is_active: isActive,
      created_at: editingCategory ? editingCategory.created_at : new Date().toISOString(),
    }

    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? catData : c)))
    } else {
      setCategories([...categories, catData])
    }

    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Structure
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize garland groups, banner photography, and Devanagari labels
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-saffron text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-cream shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-ivory text-muted-foreground uppercase text-[11px] font-semibold border-b border-cream">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Category Name & Preview</th>
              <th className="py-3 px-4">Marathi Label</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/60">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-cream/20 transition-colors">
                <td className="py-3 px-4 font-bold text-muted-foreground">{cat.display_order}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image_url || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=200&auto=format&fit=crop&q=80'}
                      alt={cat.name}
                      className="w-10 h-10 rounded-xl object-cover border border-cream"
                    />
                    <div>
                      <p className="font-semibold text-brown">{cat.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-marathi text-sm text-rose font-medium">
                  {cat.name_marathi || '—'}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      'badge-tag text-[10px]',
                      cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}
                  >
                    {cat.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg hover:bg-cream text-brown"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-rose/10 text-rose"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-cream shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cream pb-3">
              <h2 className="font-display font-bold text-xl text-brown">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-brown" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Marathi Name</label>
                <input
                  type="text"
                  value={nameMarathi}
                  onChange={(e) => setNameMarathi(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-marathi"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-brown cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-saffron accent-saffron"
                  />
                  <span>Active (Visible on public catalogue)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cream">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-cream text-brown"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-saffron text-xs py-2 px-5">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

