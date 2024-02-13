import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Form} from "react-bootstrap";

const RealizationCustomerList = observer(({currentCustomer, setCurrentCustomer}) => {
    const {customers} = useContext(Context)
    return (
        <Form id="realizationCustomersForm">
            <Form.Select className="py-1" disabled={customers.customers?.length<2 || !customers.customers} onChange={(e) => {
                setCurrentCustomer(e.target.value)
            }} value={currentCustomer || 0}>
                <option value={'0'}>Клиент не выбран</option>
                {customers.filteredCustomers?.length > 0 &&
                    customers.filteredCustomers.map(c =>
                        <option key={c.Код} value={c.Код}>
                            {c.Имя} | {c.Телефон} | {c.Адрес}
                        </option>
                    )
                }

            </Form.Select>

        </Form>

    );
});

export default RealizationCustomerList;