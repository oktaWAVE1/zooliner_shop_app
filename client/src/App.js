import './App.css';

import React, {useContext, useEffect, useState, Suspense} from "react";
import {BrowserRouter} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import Loader from "./UI/Loader/Loader";
import {check} from "./http/userAPI";
import {fetchUnreadSiteOrders} from "./http/siteAPI";

const AppRouter = React.lazy(() => import('./components/appRouter'));
const MyNavbar = React.lazy(() => import('./components/navbar/MyNavbar'));


const App = observer(() => {
  const {user, siteOrders} = useContext(Context)
  const [loading, setLoading] = useState(false)
  useEffect(() => {

    const siteOrderInterval =  setInterval(async () => {
      await fetchUnreadSiteOrders().then(data => {
        siteOrders.setSiteOrders(data)
      })
    }, 1000 * 60)
    check().then(data => {
      if(typeof data === 'object') {
        user.setUser(data);
        user.setIsAuth(true);
      }

    }).finally(() => {
      setLoading(false)
      setTimeout(() => {
        if(!user.user?.role){
          user.setIsAuth(false);
        }
      }, 1000)
    })
    return () => {clearInterval(siteOrderInterval)}
    // eslint-disable-next-line
  },[])
 

  if(loading) {
    return <Loader />
  }
  return (
      <>
        <BrowserRouter>
          <Suspense>
            <MyNavbar/>
          </Suspense>

          <div className="mainContainer">

            <Suspense fallback={<Loader />}>
              <AppRouter/>
            </Suspense>
          </div>

        </BrowserRouter>
      </>

  );
});

export default App;
