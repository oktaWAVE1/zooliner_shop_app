import React from 'react';
import {Container} from "react-bootstrap";
import CustomersFilters from "../components/features/CustomersFilters";
import CustomerNewItem from "../components/features/CustomerNewItem";
import CustomersList from "../components/features/CustomersList";

const CustomersPage = () => {
    return (
        <Container>
            <h3 className="text-center">Список клиентов:</h3>
            <CustomersFilters />
            <CustomerNewItem />
            <CustomersList />
        </Container>
    );
};

export default CustomersPage;