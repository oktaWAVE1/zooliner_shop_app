import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import {editOrder} from "../../http/orderAPI";
import useDebounce from "../../hooks/useDebounce";

const OrderListItem = ({order}) => {
    const [currentOrder, setCurrentOrder] = useState({Описание: order.Описание, Выполнено: order.Выполнено});
    const date = new Date(order.Дата)
    const patchOrder = async () => {
        await editOrder({
            Описание: currentOrder.Описание,
            Выполнено: currentOrder.Выполнено,
            Счетчик: order.Счетчик
        })
    }
    useDebounce(async () => {
        await patchOrder()
    }, 1000, [currentOrder])

    return (
        <Form className="orderListItem">
            <div>{order.Счетчик}</div>
            <div>{date.toLocaleDateString()}</div>

            <textarea rows={2} value={currentOrder.Описание} onChange={e => setCurrentOrder({...currentOrder, Описание: e.target.value})} />
            <Form.Check label={'✓'} checked={currentOrder.Выполнено} onChange={() => setCurrentOrder({...currentOrder, Выполнено: !currentOrder.Выполнено})} />


        </Form>
    );
};

export default OrderListItem;