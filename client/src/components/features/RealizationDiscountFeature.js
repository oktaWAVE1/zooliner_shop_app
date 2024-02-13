import React from 'react';
import {Form} from "react-bootstrap";
import {updateRealizationDiscount} from "../../http/realizationAPI";

const RealizationDiscountFeature = ({discount, setDiscount, id, setRefresh}) => {
    const updateDiscount = async (e) => {
        e.preventDefault()
        await updateRealizationDiscount({
            discount: discount.sum,
            discountDescription: discount.description,
            realizationId: id
        }).then(() => setRefresh(prev => prev + 1))
    }
    return (
        <Form id="RealizationDiscountForm" className="d-flex gap-1 mt-1">
            <Form.Control className="py-1" style={{width: "150px"}} type='number' placeholder="Сумма скидки..." value={discount.sum===0 ? '' : discount.sum} onChange={e => setDiscount({...discount, sum: e.target.value})} />
            <Form.Control className="py-1" type='text' placeholder="Комментарий к скидке..." value={discount.description} onChange={e => setDiscount({...discount, description: e.target.value})} />
            <button onClick={e => updateDiscount(e)} className="px-1 py-1">ПОДТВЕРДИТЬ</button>
        </Form>
    );
};

export default RealizationDiscountFeature;