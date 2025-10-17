import React from 'react';
import {Container} from "react-bootstrap";
import NewInvoiceList from "../components/features/admin/NewInvoiceList";

const InvoicePage = () => {
    return (
        <Container>
            <h1>Приходы:</h1>
            <NewInvoiceList />
        </Container>
    );
};

export default InvoicePage;