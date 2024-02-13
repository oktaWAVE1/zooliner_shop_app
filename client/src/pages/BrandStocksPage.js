import React from 'react';
import BrandList from "../components/features/BrandList";
import {Container} from "react-bootstrap";

const BrandStocksPage = () => {
    return (
        <Container>
            <h3 className="text-center">Печать остатков по бренду: </h3>
            <BrandList />

        </Container>
    );
};

export default BrandStocksPage;