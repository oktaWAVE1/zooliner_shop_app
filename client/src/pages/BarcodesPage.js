import React from 'react';
import {Container} from "react-bootstrap";
import BarcodeNewItem from "../components/features/BarcodeNewItem";
import BarcodeList from "../components/features/BarcodeList";
import BarcodeEditItem from "../components/features/BarcodeEditItem";

const BarcodesPage = () => {

    return (
        <Container>
            <h3 className='text-center'>Штрихкоды:</h3>
            <BarcodeNewItem />
            <BarcodeEditItem />
            <BarcodeList />
        </Container>
    );
};

export default BarcodesPage;