import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Accordion, Form} from "react-bootstrap";
import {addNewCustomer} from "../../http/customerAPI";

const CustomerNewItem = observer(() => {
    const [newCustomer, setNewCustomer] = useState({Имя: '', Телефон: '', Адрес: '', Комментарий: ''});
    const [accordionKey, setAccordionKey] = useState("1");
    const {loading} = useContext(Context)
    const addCustomer = async (e) => {
        e.preventDefault()
        await addNewCustomer({
            Имя: newCustomer.Имя,
            Телефон: newCustomer.Телефон,
            Адрес: newCustomer.Адрес,
            Комментарий: newCustomer.Комментарий}).then(() => loading.setRefresh(prev => prev+1))
        setAccordionKey("1")
    }
    return (
        <Accordion activeKey={accordionKey} className="addCustomerAccordion mb-3 mt-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => setAccordionKey(accordionKey==="1" ? "0" : "1")}><div className="text-center w-100"><b>ДОБАВИТЬ КЛИЕНТА</b></div></Accordion.Header>
                <Accordion.Body>
                    <Form id='addCustomerForm' className="d-flex flex-column gap-1 justify-content-center">
                        <Form.Control type='text' value={newCustomer.Имя} onChange={e => setNewCustomer({...newCustomer, Имя: e.target.value})} placeholder={"Имя..."} />
                        <Form.Control type='text' value={newCustomer.Телефон} onChange={e => setNewCustomer({...newCustomer, Телефон: e.target.value})} placeholder={"Телефон..."} />
                        <Form.Control type='text' value={newCustomer.Адрес} onChange={e => setNewCustomer({...newCustomer, Адрес: e.target.value})} placeholder={"Адрес..."} />
                        <Form.Control type='text' value={newCustomer.Комментарий} onChange={e => setNewCustomer({...newCustomer, Комментарий: e.target.value})} placeholder={"Комментарий..."} />
                        <button className="mt-2" disabled={newCustomer.Телефон.length<1} onClick={e => addCustomer(e)}>ДОБАВИТЬ</button>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

export default CustomerNewItem;