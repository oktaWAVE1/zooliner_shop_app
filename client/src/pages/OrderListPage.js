import React from 'react';
import ProductsOrderList from "../components/features/admin/ProductsOrderList";
import {Container} from "react-bootstrap";

const OrderListPage = () => {
    return (
        <Container>
            <h1>Список для заказа:</h1>
            <ProductsOrderList />
        </Container>
    );
};

export default OrderListPage;