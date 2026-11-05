import { useState, useEffect } from 'react'
import {
  Sparkles,
  MessageCircle,
  Camera,
  CheckCircle2,
  X,
  IndianRupee,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { customRequestService } from '@/services/customRequestService'
import { useSettingsStore } from '@/stores/settingsStore'
import type { CustomRequest, CustomRequestStatus } from '@/types/database'
import { formatINR, formatDateIST, buildWhatsAppLink, cn } from '@/lib/utils'

export function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [selectedReq, setSelectedReq] = useState<CustomRequest | null>(null)
  const [quotationAmount, setQuotationAmount] = useState<number | ''>('')
  const [adminNote, setAdminNote] = useState('')
  const settings = useSettingsStore((state) => state.settings)

  const loadRequests = () => {
    customRequestService.getAllRequests().then(setRequests)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleUpdateQuotation = (req: CustomRequest) => {
    const updated = requests.map((r) =>
      r.id === req.id
        ? {
            ...r,
            quoted_amount: quotationAmount ? Number(quotationAmount) : r.quoted_amount,
            admin_notes: adminNote || r.admin_notes,
            status: 'quoted' as CustomRequestStatus,
          }
        : r
    )
    setRequests(updated)
    setSelectedReq(null)
    setQuotationAmount('')
    setAdminNote('')
  }

  const handleStatusChange = (reqId: string, status: CustomRequestStatus) => {
    setRequests(requests.map((r) => (r.id === reqId ? { ...r, status } : r)))
    if (selectedReq && selectedReq.id === reqId) {
      setSelectedReq({ ...selectedReq, status })
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-rose/15 text-rose border border-rose/30">
            Bespoke Inquiries
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Custom Garland Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review customer reference images, send price quotations, and convert to active orders
          </p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-cream shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-ivory text-muted-foreground uppercase text-[11px] font-semibold border-b border-cream">
              <tr>
                <th className="py-3 px-4">Request ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Occasion & Timing</th>
                <th className="py-3 px-4">Reference Photo</th>
                <th className="py-3 px-4">Customer Budget</th>
                <th className="py-3 px-4">Quote Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/60">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                    No custom design requests received yet. Customer submissions will appear here.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-brown">{req.request_number}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDateIST(req.created_at)}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-brown">{req.customer_name}</p>
                      <a
                        href={`tel:${req.customer_phone}`}
                        className="text-xs text-saffron font-mono hover:underline"
                      >
                        {req.customer_phone}
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-brown">{req.occasion || 'General'}</p>
                      {req.required_date && (
                        <p className="text-xs text-muted-foreground">{formatDateIST(req.required_date)}</p>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {req.reference_image_url ? (
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="w-12 h-12 rounded-xl overflow-hidden border border-cream hover:border-saffron block"
                        >
                          <img
                            src={req.reference_image_url}
                            alt="Reference"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No image</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-medium text-brown">
                      {req.budget_max ? `${formatINR(req.budget_min || 0)} - ${formatINR(req.budget_max)}` : 'Flexible'}
                    </td>

                    <td className="py-3 px-4 font-bold text-saffron">
                      {req.quoted_amount ? formatINR(req.quoted_amount) : 'Not Quoted'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'badge-tag capitalize text-[10px]',
                          req.status === 'new'
                            ? 'bg-rose/15 text-rose'
                            : req.status === 'quoted'
                            ? 'bg-saffron/20 text-saffron-800'
                            : req.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-cream text-brown'
                        )}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={buildWhatsAppLink(
                            req.customer_phone,
                            `Namaste ${req.customer_name}, regards your custom garland request (${req.request_number}) at ${settings.store_name}: `
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                          title="WhatsApp Reply"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>

                        <button
                          onClick={() => {
                            setSelectedReq(req)
                            setQuotationAmount(req.quoted_amount || '')
                            setAdminNote(req.admin_notes || '')
                          }}
                          className="p-1.5 rounded-lg hover:bg-cream text-brown"
                          title="Review & Quote"
                        >
                          Quote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Quote Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-cream shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-cream pb-3">
              <h2 className="font-display font-bold text-xl text-brown">
                Custom Request {selectedReq.request_number}
              </h2>
              <button onClick={() => setSelectedReq(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-brown" />
              </button>
            </div>

            {/* Photo Preview */}
            {selectedReq.reference_image_url && (
              <div className="rounded-2xl overflow-hidden border border-cream max-h-60 bg-cream/30 flex items-center justify-center">
                <img
                  src={selectedReq.reference_image_url}
                  alt="Customer Reference"
                  className="max-h-60 object-contain"
                />
              </div>
            )}

            {/* Details */}
            <div className="space-y-2 text-xs sm:text-sm bg-ivory/50 p-4 rounded-2xl border border-cream">
              <p><strong>Customer:</strong> {selectedReq.customer_name} ({selectedReq.customer_phone})</p>
              <p><strong>Occasion:</strong> {selectedReq.occasion || 'N/A'}</p>
              <p><strong>Required Date:</strong> {selectedReq.required_date ? formatDateIST(selectedReq.required_date) : 'Flexible'}</p>
              {selectedReq.description && <p><strong>Description:</strong> {selectedReq.description}</p>}
              {selectedReq.flower_preferences && <p><strong>Flower Preferences:</strong> {selectedReq.flower_preferences}</p>}
              {selectedReq.preferred_colours && <p><strong>Colours:</strong> {selectedReq.preferred_colours}</p>}
            </div>

            {/* Quotation Form */}
            <div className="space-y-3 bg-cream/40 p-4 rounded-2xl border border-cream">
              <h4 className="font-semibold text-xs text-brown">Set Quoted Price (₹)</h4>
              <input
                type="number"
                value={quotationAmount}
                onChange={(e) => setQuotationAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 2800"
                className="w-full py-2 px-3 rounded-xl border border-cream bg-white text-sm font-bold text-brown"
              />

              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Internal or customer notes..."
                className="w-full p-2.5 rounded-xl border border-cream bg-white text-xs resize-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedReq.id, 'accepted')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-100 text-green-800"
                >
                  Mark Accepted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedReq.id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose/15 text-rose"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={() => handleUpdateQuotation(selectedReq)}
                className="btn-saffron text-xs py-2 px-5"
              >
                Save Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

