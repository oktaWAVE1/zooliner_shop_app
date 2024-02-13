import IndexPage from "./pages/IndexPage";
import AuthPage from "./pages/AuthPage";
import RealizationsPage from "./pages/RealizationsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import RealizationItemPage from "./pages/RealizationItemPage";
import BarcodesPage from "./pages/BarcodesPage";
import PriceTagsPage from "./pages/PriceTagsPage";
import PrintTagsPage from "./pages/PrintTagsPage";
import PrintBrandStocksPage from "./pages/PrintBrandStocksPage";
import BrandStocksPage from "./pages/BrandStocksPage";
import PrintOrderPage from "./pages/PrintOrderPage";

export const publicRoutes = [
    {path: '/', element: <IndexPage/>},
    {path: '/auth', element: <AuthPage/>},
    {path: '/print/order/:id', element: <PrintOrderPage />},

]

export const authRoutes = [
    {path: '/', element: <IndexPage/>},
]

export const managerRoutes = [
    {path: '/manager/realizations', element: <RealizationsPage />},
    {path: '/manager/realizations/item/:id', element: <RealizationItemPage />},
    {path: '/orders', element: <OrdersPage />},
    {path: '/customers', element: <CustomersPage />},
    {path: '/barcodes', element: <BarcodesPage />},
    {path: '/price-tags', element: <PriceTagsPage />},
    {path: '/print/price-tags', element: <PrintTagsPage />},
    {path: '/print/order/:id', element: <PrintOrderPage />},
    {path: '/print/brand-stocks/:id', element: <PrintBrandStocksPage />},
    {path: '/brand-stocks', element: <BrandStocksPage />},
]

export const adminRoutes = [
    {path: '/manager/realizations', element: <RealizationsPage />},
    {path: '/manager/realizations/item/:id', element: <RealizationItemPage />},
    {path: '/orders', element: <OrdersPage />},
    {path: '/customers', element: <CustomersPage />},
    {path: '/barcodes', element: <BarcodesPage />},
    {path: '/price-tags', element: <PriceTagsPage />},
    {path: '/print/order/:id', element: <PrintOrderPage />},
    {path: '/print/price-tags', element: <PrintTagsPage />},
    {path: '/print/brand-stocks/:id', element: <PrintBrandStocksPage />},
    {path: '/brand-stocks', element: <BrandStocksPage />},
]