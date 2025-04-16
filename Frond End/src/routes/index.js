import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import HomePage from "../pages/HomePage/HomePage";
import MyOrderPage from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSucess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import PaymentResult from "../pages/PaymentResult/PaymentResult";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

// export const routes = [
//     {
//         path: '/',
//         page: HomePage,
//         isShowHeader: true,
//     },
//     {
//         path: '/order',
//         page: OrderPage,
//         isShowHeader: true
//     },
//     {
//         path: '/my-order',
//         page: MyOrderPage,
//         isShowHeader: true
//     },
//     {
//         path: '/details-order/:id',
//         page: DetailsOrderPage,
//         isShowHeader: true
//     },
//     {
//         path: '/payment',
//         page: PaymentPage,
//         isShowHeader: true
//     },
//     {
//         path: '/orderSuccess',
//         page: OrderSucess,
//         isShowHeader: true
//     },
//     {
//         path: '/products',
//         page: ProductsPage,
//         isShowHeader: true
//     },
//     {
//         path: '/product/:type',
//         page: TypeProductPage,
//         isShowHeader: true
//     },
//     {
//         path: '/sign-in',
//         page: SignInPage,
//         isShowHeader: false
//     },
//     {
//         path: '/sign-up',
//         page: SignUpPage,
//         isShowHeader: false
//     },
//     {
//         path: '/product-details/:id',
//         page: ProductDetailsPage,
//         isShowHeader: true
//     },
//     {
//         path: '/profile-user',
//         page: ProfilePage,
//         isShowHeader: true
//     },
//     {
//         path: '/system/admin',
//         page: AdminPage,
//         isShowHeader: false,
//         isPrivated: true
//     },
//     {
//         path: '*',
//         page: NotFoundPage
//     },
//     {
//         path: '/payment-result',
//         page: PaymentResult
//     }
// ]


export const routes = [
    {
      path: '/',
      page: HomePage,
      isShowHeader: true,
      protected: false
    },
    {
      path: '/order',
      page: OrderPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/my-order',
      page: MyOrderPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/details-order/:id',
      page: DetailsOrderPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/payment',
      page: PaymentPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/orderSuccess',
      page: OrderSucess,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/products',
      page: ProductsPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/product/:type',
      page: TypeProductPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/sign-in',
      page: SignInPage,
      isShowHeader: false,
      protected: false
    },
    {
      path: '/sign-up',
      page: SignUpPage,
      isShowHeader: false,
      protected: false
    },
    {
      path: '/product-details/:id',
      page: ProductDetailsPage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/profile-user',
      page: ProfilePage,
      isShowHeader: true,
      protected: true
    },
    {
      path: '/system/admin',
      page: AdminPage,
      isShowHeader: false,
      protected: true
    },
    {
      path: '*',
      page: NotFoundPage,
      protected: false
    },
    {
      path: '/payment-result',
      page: PaymentResult,
      protected: false
    }
  ];
