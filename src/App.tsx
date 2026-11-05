import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import { CustomerLayout } from '@/components/layout/CustomerLayout'
import { AdminLayout } from '@/components/admin/AdminLayout'

// Customer Pages
import { HomePage } from '@/pages/customer/HomePage'
import { CataloguePage } from '@/pages/customer/CataloguePage'
import { CategoryPage } from '@/pages/customer/CategoryPage'
import { ProductPage } from '@/pages/customer/ProductPage'
import { CartPage } from '@/pages/customer/CartPage'
import { CheckoutPage } from '@/pages/customer/CheckoutPage'
import { OrderSuccessPage } from '@/pages/customer/OrderSuccessPage'
import { CustomRequestPage } from '@/pages/customer/CustomRequestPage'
import { ContactPage } from '@/pages/customer/ContactPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Admin Pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminCustomRequestsPage } from '@/pages/admin/AdminCustomRequestsPage'
import { AdminDeliveriesPage } from '@/pages/admin/AdminDeliveriesPage'
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage'
import { AdminQrCodePage } from '@/pages/admin/AdminQrCodePage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/custom-request" element={<CustomRequestPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="custom-requests" element={<AdminCustomRequestsPage />} />
            <Route path="deliveries" element={<AdminDeliveriesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="qr-code" element={<AdminQrCodePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

