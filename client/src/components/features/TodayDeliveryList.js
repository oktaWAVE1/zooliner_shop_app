import React, {useEffect, useState} from 'react';
import {Accordion} from "react-bootstrap";
import {fetchRealizationsToday} from "../../http/realizationAPI";


const TodayDeliveryList = () => {
    const [realizations, setRealizations] = useState([]);
    useEffect(() => {
        fetchRealizationsToday().then(data => {
            console.log(data)
            setRealizations(data)})
    }, []);
    const [accordionKey, setAccordionKey] = useState("1");
    return (
        <Accordion activeKey={accordionKey} className="addBarcodeAccordion mb-3">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => {
                    setAccordionKey(accordionKey==="1" ? "0" : "1")
                }}><div className="text-center w-100"><b>СПИСОК ДОСТАВОК НА СЕГОДНЯ</b></div></Accordion.Header>
                <Accordion.Body>
                    {realizations.length>0 &&
                        realizations.map(r =>
                            <div key={r.Счетчик}>
                                <div>Доставка: {r?.deliveryRemote?.name}</div>
                                <div>Клиент: {r?.customersRemote?.Имя}</div>
                                <div>Адрес: {r?.customersRemote?.Адрес}</div>
                                <hr />
                            </div>
                        )
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default TodayDeliveryList;