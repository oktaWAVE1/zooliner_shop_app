import React, {useState} from 'react';
import useDebounce from "../../hooks/useDebounce";
import {Form} from "react-bootstrap";
import {editCustomer} from "../../http/customerAPI";

const CustomersListItem = ({customer}) => {
    const [currentCustomer, setCurrentCustomer] = useState({Имя: customer.Имя, Телефон: customer.Телефон, Адрес: customer.Адрес, Комментарий: customer.Комментарий});
    const patchCustomer = async () => {
        await editCustomer({
            Имя: currentCustomer.Имя,
            Телефон: currentCustomer.Телефон,
            Адрес: currentCustomer.Адрес,
            Комментарий: currentCustomer.Комментарий,
            Код: customer.Код
        })
    }
    useDebounce(async () => {
        await patchCustomer()
    }, 1000, [currentCustomer])

    return (
        <Form className="customerListItem">
            <Form.Control type="text" value={currentCustomer.Имя || ''} onChange={e => setCurrentCustomer({...currentCustomer, Имя: e.target.value})} placeholder="Имя..." />
            <Form.Control type="text" value={currentCustomer.Телефон || ''} onChange={e => setCurrentCustomer({...currentCustomer, Телефон: e.target.value})} placeholder="Телефон..." />
            <Form.Control type="text" value={currentCustomer.Адрес || ''} onChange={e => setCurrentCustomer({...currentCustomer, Адрес: e.target.value})} placeholder="Адрес..." />
            <Form.Control type="text" value={currentCustomer.Комментарий || ''} onChange={e => setCurrentCustomer({...currentCustomer, Комментарий: e.target.value})} placeholder="Комментарий..." />
        </Form>
    );
};

export default CustomersListItem;