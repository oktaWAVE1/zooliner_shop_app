import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";

const CountWeightFeature = ({refresh}) => {
    const [price, setPrice] = useState(0);
    const [sum, setSum] = useState(0);
    useDebounce(() => {
        setPrice(0)
        setSum(0)
    }, 50, [refresh])
    return (
        <Form id="countWeightForm" className="d-flex gap-1 align-items-center">
            <Form.Control className="py-1" style={{width: "130px"}} type={'number'} value={price ? price : ""} onChange={e => setPrice(e.target.value)} placeholder="Цена за г./кг..." />
            <Form.Control className="py-1" style={{width: "130px"}} type={'number'} value={sum ? sum : ""} onChange={e => setSum(e.target.value)} placeholder="На сумму..." />
            <div className={price && sum ? "expectedWeight" : "expectedWeight hidden"}>
                {price && sum ? `${price<50 ? Math.ceil(sum/(price)) : Math.ceil(sum/price*1000)} г.` : ""}
            </div>
        </Form>
    );
};

export default CountWeightFeature;