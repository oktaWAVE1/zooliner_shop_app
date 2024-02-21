import React from 'react';
import {Container} from "react-bootstrap";
import SiteOrdersList from "../components/features/SiteOrdersList";

const SireOrderPage = () => {
    return (
        <Container>
            <h3 className="text-center w-100">Список заказов:</h3>
            <SiteOrdersList />
            
        </Container>
    );
};

export default SireOrderPage;