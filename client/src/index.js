import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import UserStore from "./store/UserStore";
import ProductsStore from "./store/ProductsStore";
import LoadingStore from "./store/LoadingStore";
import RealizationsStore from "./store/RealizationsStore";
import OrdersStore from "./store/OrdersStore";
import CustomersStore from "./store/CustomersStore";
import PageStore from "./store/PageStore";
import SiteOrdersStore from "./store/SiteOrdersStore";

export const Context = createContext(null)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        products: new ProductsStore(),
        loading: new LoadingStore(),
        realizations: new RealizationsStore(),
        orders: new OrdersStore(),
        customers: new CustomersStore(),
        currentPages: new PageStore(),
        siteOrders: new SiteOrdersStore()
    }}
    >

        <div className='App'>
            <App />

        </div>


    </Context.Provider>
);


