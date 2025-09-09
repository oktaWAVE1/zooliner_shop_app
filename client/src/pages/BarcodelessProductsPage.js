import React from "react";
import BarcodelessProducts from "../components/features/BarcodelessProducts";

const BarcodelessProductsPage = () => {
    return (
        <div>
            <h3 className='text-center'>Штрихкоды товаров:</h3>
            <BarcodelessProducts />
        </div>
    );
};

export default BarcodelessProductsPage;