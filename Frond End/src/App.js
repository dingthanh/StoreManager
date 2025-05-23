import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { routes } from './routes'
import { isJsonString } from './utils'
import jwt_decode from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponent/Loading'


// function App() {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(false)
//   const user = useSelector((state) => state.user)

//   useEffect(() => {
//     setIsLoading(true)
//     const { storageData, decoded } = handleDecoded()
//     if (decoded?.id) {
//       handleGetDetailsUser(decoded?.id, storageData)  
//     }
//     setIsLoading(false)
//   }, [])

//   const handleDecoded = () => {
//     let storageData = user?.access_token || localStorage.getItem('access_token')
//     let decoded = {}
//     if (storageData && isJsonString(storageData) && !user?.access_token) {
//       storageData = JSON.parse(storageData)
//       decoded = jwt_decode(storageData)
//     }
//     return { decoded, storageData }
//   }

//   UserService.axiosJWT.interceptors.request.use(async (config) => {
//     // Do something before request is sent
//     const currentTime = new Date()
//     const { decoded } = handleDecoded()
//     let storageRefreshToken = localStorage.getItem('refresh_token')
//     const refreshToken = JSON.parse(storageRefreshToken)
//     const decodedRefreshToken =  jwt_decode(refreshToken)
//     if (decoded?.exp < currentTime.getTime() / 1000) {
//       if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
//         const data = await UserService.refreshToken(refreshToken)
//         config.headers['token'] = `Bearer ${data?.access_token}`
//       }else {
//         dispatch(resetUser())
//       }
//     }
//     return config;
//   }, (err) => {
//     return Promise.reject(err)
//   })

//   const handleGetDetailsUser = async (id, token) => {
//     let storageRefreshToken = localStorage.getItem('refresh_token')
//     const refreshToken = JSON.parse(storageRefreshToken)
//     const res = await UserService.getDetailsUser(id, token)
//     dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken}))
//   }

//   //
//   const isLoggedIn = () => {
//     return !!localStorage.getItem('access_token');
//   };
  
//   // Component bảo vệ
//   const ProtectedRoute = ({ element }) => {
//     return isLoggedIn() ? element : <Navigate to="/sign-in" replace />;
//   };

//   // return (
//   //   <div style={{height: '100vh', width: '100%'}}>
//   //     <Loading isLoading={isLoading}>
//   //       <Router>
//   //         <Routes>
//   //           {routes.map((route) => {
//   //             const Page = route.page
//   //             const Layout = route.isShowHeader ? DefaultComponent : Fragment
//   //             return (
//   //               <Route key={route.path} path={route.path} element={
//   //                 <Layout>
//   //                   <Page />
//   //                 </Layout>
//   //               } />
//   //             )
//   //           })}
//   //         </Routes>
//   //       </Router>
//   //     </Loading>
//   //   </div>
//   // )


//   return (
//     <div style={{ height: '100vh', width: '100%' }}>
//       <Loading isLoading={isLoading}>
//         <Router>
//           <Routes>
//             {routes.map((route) => {
//               const Page = route.page;
//               const Layout = route.isShowHeader ? DefaultComponent : Fragment;
//               const element = (
//                 <Layout>
//                   <Page />
//                 </Layout>
//               );
  
//               // Nếu route cần đăng nhập (giả sử route.protected = true)
//               const finalElement = route.protected
//                 ? <ProtectedRoute element={element} />
//                 : element;
  
//               return (
//                 <Route
//                   key={route.path}
//                   path={route.path}
//                   element={finalElement}
//                 />
//               );
//             })}
//           </Routes>
//         </Router>
//       </Loading>
//     </div>
//   );


// //   return (
// //     <div className="app-container">
// //       <Loading isLoading={isLoading}>
// //         <Router>
// //           <Routes>
// //             {routes.map((route) => {
// //               const Page = route.page;
// //               const Layout = route.isShowHeader ? DefaultComponent : Fragment;
// //               const element = (
// //                 <Layout>
// //                   <Page />
// //                 </Layout>
// //               );

// //               const finalElement = route.protected
// //                 ? <ProtectedRoute element={element} />
// //                 : element;

// //               return (
// //                 <Route
// //                   key={route.path}
// //                   path={route.path}
// //                   element={finalElement}
// //                 />
// //               );
// //             })}
// //           </Routes>
// //         </Router>
// //       </Loading>
// //     </div>
// //   );
// }

function App(){
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token');
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }
    return { decoded, storageData };
  };

  const handleGetDetailsUser = async (id, token) => {
    const refreshToken = JSON.parse(localStorage.getItem('refresh_token'));
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { storageData, decoded } = handleDecoded();
      if (decoded?.id) {
        await handleGetDetailsUser(decoded.id, storageData);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  // Axios interceptor
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      const refreshToken = JSON.parse(localStorage.getItem('refresh_token'));
      const decodedRefreshToken = jwt_decode(refreshToken);

      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers['token'] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  const isLoggedIn = () => {
    const token = localStorage.getItem('access_token');
    return token && token !== 'undefined' && token !== 'null';
  };

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn() ? element : <Navigate to="/sign-in" replace />;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const pageElement = <Page />;
              const elementWithLayout = route.isShowHeader
                ? <DefaultComponent>{pageElement}</DefaultComponent>
                : pageElement;

              const finalElement = route.protected
                ? <ProtectedRoute element={elementWithLayout} />
                : elementWithLayout;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={finalElement}
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );

}

export default App