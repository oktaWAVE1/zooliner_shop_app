import React from 'react';
import {Container} from "react-bootstrap";
import PriceTagNewItem from "../components/features/PriceTagNewItem";
import PriceTagsList from "../components/features/PriceTagsList";
import PriceTagsToPrint from "../components/features/PriceTagsToPrint";


const PriceTagsPage = () => {
    return (
        <Container>
            <h3 className="text-center">Ценники:</h3>
            <PriceTagNewItem />
            <PriceTagsList />

        </Container>

    );
};

export default PriceTagsPage;