import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import RealizationSalesList from "../components/features/RealizationSalesList";
import RealizationHeader from "../components/features/RealizationHeader";

const RealizationItemPage = () => {
    const {id} = useParams()
    const [refresh, setRefresh] = useState(1);
    return (
        <Container>
            <h3 className="text-center">Реализация № {id}</h3>
            <RealizationHeader refresh={refresh} setRefresh={setRefresh} id={id} />
            <RealizationSalesList setRefresh={setRefresh}  />
        </Container>
    );
};

export default RealizationItemPage;