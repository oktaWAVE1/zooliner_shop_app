import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import {updateProductPrice} from "../../../http/productAPI";

const FinishedInvoiceItem = ({item, setRefresh}) => {
    console.log('render')
    const [currentPrice, setCurrentPrice] = useState(item['productsRemote.Цена'])
    const handleUpdateProductPrice = async (e) => {
        e.preventDefault();
        await updateProductPrice({id: item.Код, price: currentPrice}).then(() => setRefresh(prev => prev+1));
    }
    const lastMarkup = item.Цена ? Math.round(((currentPrice/item.Цена-1)*100), 0) : 0
    const middleMarkup = item['productsRemote.Средний закуп'] ? Math.round(((currentPrice/item['productsRemote.Средний закуп']-1)*100), 0) : 0

    return (
        <div className="finished-invoice-item">
            <div title="Код">{item.Код}</div>
            <div title="Наименование">{item.Наименование}</div>
            <div className="text-center" title="Количество"><strong>{item.Количество}</strong></div>
            <div className="text-center" title="Количество">{item['productsRemote.product_in_stock']}</div>
            <div className="text-center" title="Цена закупа">{Math.round(item.Цена, 2)}</div>
            <div className="text-center" title="Сумма закупа">{Math.round(item.Сумма)}</div>
            <Form>
                <Form.Control onBlur={e => {handleUpdateProductPrice(e)}} className="text-center" type="number" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
            </Form>
            <div className="text-center" style={{color: lastMarkup<28 ? "red" : "inherit"}} title="Наценка последняя">{lastMarkup}%</div>
            <div className="text-center" style={{color: middleMarkup<28 ? "red" : "inherit"}} title="Наценка средняя">{middleMarkup}%</div>
        </div>
    );
};

export default FinishedInvoiceItem;