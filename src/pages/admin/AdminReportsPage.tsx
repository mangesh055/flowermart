import { useState, useEffect } from 'react'
import {
  Download,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ShoppingBag,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types/database'
import { formatINR, formatDateIST } from '@/lib/utils'

export function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    orderService.getAllOrders().then((data) => {
      setOrders(data)
      setIsLoading(false)
    })
  }, [])

  // Metrics (Only count completed/paid orders as realized revenue)
  const realizedOrders = orders.filter(
    (o) => o.status === 'completed' || o.payment_status === 'paid'
  )
  const realizedRevenue = realizedOrders.reduce(
    (sum, o) => sum + (o.total_amount || 0),
    0
  )
  const completedCount = orders.filter((o) => o.status === 'completed').length
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length

  // Product-wise sales aggregation
  const productStats: Record<string, { name: string; quantity: number; revenue: number }> = {}
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      if (!productStats[item.product_name]) {
        productStats[item.product_name] = {
          name: item.product_name,
          quantity: 0,
          revenue: 0,
        }
      }
      productStats[item.product_name].quantity += item.quantity
      productStats[item.product_name].revenue += item.line_total
    })
  })

  const topProductsChartData = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name,
      revenue: p.revenue,
      units: p.quantity,
    }))

  // Export CSV Functionality
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No order data to export.')
      return
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Fulfilment',
      'Delivery Address',
      'Required Date',
      'Required Time',
      'Subtotal',
      'Delivery Charge',
      'Total Amount',
      'Order Status',
      'Payment Status',
    ]

    const rows = orders.map((o) => [
      `"${o.order_number}"`,
      `"${o.created_at}"`,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      `"${o.customer_phone}"`,
      `"${o.fulfilment_type}"`,
      `"${(o.delivery_address || '').replace(/"/g, '""')}"`,
      `"${o.required_date}"`,
      `"${o.required_time || ''}"`,
      o.subtotal,
      o.delivery_charge,
      o.total_amount,
      `"${o.status}"`,
      `"${o.payment_status}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `Santosh_Pushpa_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Title & CSV Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Financial Insights
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Sales Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track realized revenue, popular garland styles, order completion, and export official CSV reports
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-saffron text-xs py-2.5 px-4 flex items-center gap-2 shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-cream shadow-sm space-y-1">
          <span className="text-xs font-semibold text-green-700">Realized Revenue</span>
          <p className="font-display font-bold text-2xl text-green-700">{formatINR(realizedRevenue)}</p>
          <p className="text-[11px] text-muted-foreground">From paid / completed orders</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-cream shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Completed Orders</span>
          <p className="font-display font-bold text-2xl text-brown">{completedCount}</p>
          <p className="text-[11px] text-muted-foreground">Successfully fulfilled</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-cream shadow-sm space-y-1">
          <span className="text-xs font-semibold text-rose">Cancelled Orders</span>
          <p className="font-display font-bold text-2xl text-rose">{cancelledCount}</p>
          <p className="text-[11px] text-muted-foreground">Withdrawn or rejected</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-cream shadow-sm space-y-1">
          <span className="text-xs font-semibold text-saffron">Total Volume</span>
          <p className="font-display font-bold text-2xl text-brown">{orders.length}</p>
          <p className="text-[11px] text-muted-foreground">Total orders recorded</p>
        </div>
      </div>

      {/* Product-Wise Revenue Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-brown flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-saffron" />
            Product-Wise Sales & Revenue
          </h2>
          <span className="text-xs text-muted-foreground">Top Garlands</span>
        </div>

        {topProductsChartData.length === 0 ? (
          <p className="text-xs text-muted-foreground py-12 text-center">
            No sales data recorded yet to render chart.
          </p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsChartData}>
                <XAxis dataKey="name" stroke="#493629" fontSize={11} />
                <YAxis stroke="#493629" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [formatINR(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFF9F0', borderRadius: '12px', border: '1px solid #F6EBD7' }}
                />
                <Bar dataKey="revenue" fill="#E98A26" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Product Revenue Breakdown Table */}
      <div className="bg-white rounded-3xl border border-cream shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cream">
          <h3 className="font-display font-bold text-base text-brown">
            Detailed Garland Sales Breakdown
          </h3>
        </div>
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-ivory text-muted-foreground uppercase text-[11px] font-semibold border-b border-cream">
            <tr>
              <th className="py-3 px-4">Garland Variety</th>
              <th className="py-3 px-4 text-center">Units Sold</th>
              <th className="py-3 px-4 text-right">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/60">
            {Object.values(productStats).length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-xs text-muted-foreground">
                  No products sold yet.
                </td>
              </tr>
            ) : (
              Object.values(productStats).map((stat) => (
                <tr key={stat.name} className="hover:bg-cream/20">
                  <td className="py-3 px-4 font-semibold text-brown">{stat.name}</td>
                  <td className="py-3 px-4 text-center font-bold text-brown">{stat.quantity}</td>
                  <td className="py-3 px-4 text-right font-bold text-saffron">{formatINR(stat.revenue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

