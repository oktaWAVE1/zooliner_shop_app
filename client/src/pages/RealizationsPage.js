import React from 'react';
import {Container} from "react-bootstrap";
import RealizationsDateFilter from "../components/features/RealizationsDateFilter";
import RealizationsList from "../components/features/RealizationsList";
import RealizationsTotal from "../components/features/RealizationsTotal";

const RealizationsPage = () => {

    return (
        <Container>
            <h3 className="text-center">Список реализаций:</h3>
            <RealizationsDateFilter  />
            <RealizationsTotal />
            <RealizationsList />
        </Container>
    );
};

export default RealizationsPage;