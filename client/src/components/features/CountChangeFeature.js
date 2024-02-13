import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";

const CountChangeFeature = ({total, refresh}) => {
    const [cash, setCash] = useState(0);
    useDebounce(() => {
        setCash(0)
    }, 50, [refresh])
    return (
        <Form id="countChangeForm" className="d-flex gap-1 align-items-start">
            <Form.Control className="py-1" style={{width: "200px"}} type={"number"} value={cash ? cash : ''} onChange={e => setCash(e.target.value)} placeholder="Получено от клиента..."/>
            <div className={(cash && total && cash>total) ? "changeBack" : "changeBack hidden"}>{(cash && total && cash>total) ? `Сдача: ${cash-total} ₽` : ''}</div>
        </Form>
    );
};

export default CountChangeFeature;