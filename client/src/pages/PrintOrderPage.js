import React from 'react';
import OrderHeader from "../components/features/OrderHeader";
import OrderItemsList from "../components/features/OrderItemsList";

const PrintOrderPage = () => {
    return (
        <div className='orderPage'>
            <OrderHeader />
            <OrderItemsList />
        </div>
    );
};

export default PrintOrderPage;