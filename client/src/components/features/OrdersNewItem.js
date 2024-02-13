import React, {useContext, useState} from 'react';
import {Accordion, Form} from "react-bootstrap";
import {addNewOrder} from "../../http/orderAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const OrdersNewItem = observer(() => {
    const [newOrder, setNewOrder] = useState('');
    const [accordionKey, setAccordionKey] = useState("1");
    const {loading} = useContext(Context)
    const addOrder = async (e) => {
        e.preventDefault()
        await addNewOrder({Описание: newOrder}).then(() => loading.setRefresh(prev => prev+1))
        setAccordionKey("1")
    }
    return (
        <Accordion activeKey={accordionKey} className="addOrderAccordion my-3">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => setAccordionKey(accordionKey==="1" ? "0" : "1")}><div className="text-center w-100"><b>ДОБАВИТЬ ЗАКАЗ</b></div></Accordion.Header>
                <Accordion.Body>
                    <Form id='addOrderForm' className="d-flex flex-column justify-content-center">
                        <textarea rows={3} placeholder="Описание" className="mb-2" type='text' value={newOrder} onChange={e => setNewOrder(e.target.value)} />
                        <button className="mt-2" disabled={newOrder.length<1} onClick={e => addOrder(e)}>ДОБАВИТЬ</button>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

export default OrdersNewItem;