import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {fetchOrders} from "../../http/orderAPI";
import {Form} from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import {useOrdersSearch} from "../../hooks/useOrdersSearch";

const OrderFilters = observer(() => {
    const {orders, loading} = useContext(Context)
    const [unfinished, setUnfinished] = useState(true);
    const [query, setQuery] = useState('');
    useEffect(() => {
        loading.setLoading(true)
        fetchOrders().then(data => {
            orders.setOrders(data)
        }).finally(() =>
            setTimeout(() =>  loading.setLoading(false), 200)
           )
    }, [loading.refresh]);
    const filtered = useOrdersSearch(orders.orders, query, unfinished)
    useDebounce(() => {
        orders.setFilteredOrders(filtered)
    }, 250, [filtered])
    return (

        <Form className="orderFilters gap-5 w-100 pb-2">
            <Form.Switch style={{width: "250px"}} checked={unfinished} label="Только новые" onChange={() => setUnfinished(prev => !prev)} />
            <Form.Control type="text" placeholder="Поиск..." value={query} onChange={e => setQuery(e.target.value)} />
        </Form>



    );
});

export default OrderFilters;