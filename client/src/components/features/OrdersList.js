import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import OrderListItem from "./OrderListItem";
import Loader from "../../UI/Loader/Loader";

const OrdersList = observer(() => {
    const {orders, loading} = useContext(Context)
    if (loading.loading) return <Loader />
    return (
        <div>
            {orders.filteredOrders.length>0 &&
                orders.filteredOrders.map(o =>
                   <OrderListItem order={o} key={o.Счетчик} />
                )
            }
        </div>
    );
});

export default OrdersList;