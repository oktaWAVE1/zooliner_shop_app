import React from 'react';
import BrandList from "../components/features/BrandList";
import {Container} from "react-bootstrap";
import CategoriesList from "../components/features/CategoriesList";

const BrandStocksPage = () => {
    return (
        <Container>
            <h3 className="text-center">Печать остатков:</h3>
            <BrandList />
            <CategoriesList />

        </Container>
    );
};

export default BrandStocksPage;