import React from 'react';
import {Container} from "react-bootstrap";
import OrderFilters from "../components/features/OrderFilters";
import OrdersList from "../components/features/OrdersList";
import OrdersNewItem from "../components/features/OrdersNewItem";

const OrdersPage = () => {
    return (
        <Container>
            <h3 className="text-center">Заказы:</h3>
            <OrderFilters />
            <OrdersNewItem />
            <OrdersList />
        </Container>
    );
};

export default OrdersPage;