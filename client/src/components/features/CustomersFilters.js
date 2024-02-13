import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Form} from "react-bootstrap";
import {fetchCustomers} from "../../http/customerAPI";
import {useCustomersSearch} from "../../hooks/useCustomersSearch";
import useDebounce from "../../hooks/useDebounce";

const CustomersFilters = observer(({refresh}) => {
    const {customers, loading, currentPages} = useContext(Context)
    const [query, setQuery] = useState('');
    useEffect(() => {
        loading.setLoading(true)
        fetchCustomers().then(data => {
            customers.setCustomers(data)
        }).finally(() => {
            setTimeout(() =>  loading.setLoading(false), 20)
            currentPages.setPage(1)
        }
        )
    }, [loading.refresh]);

    useEffect(() => {
        setQuery('')
    }, [refresh]);

    useDebounce(() => {
        customers.setCurrentCustomers([...customers.filteredCustomers].slice(15*(currentPages.page-1), 15*currentPages.page))
    }, 0, [currentPages.page, customers.filteredCustomers]);

    const filtered = useCustomersSearch(customers.customers, query)
    useDebounce(() => {
        customers.setFilteredCustomers(filtered)
        currentPages.setPage(1)
    }, 250, [filtered])
    return (

        <Form className="customerFilters w-100">
            <Form.Control className="py-1" type="text" placeholder="Поиск клиента..." value={query} onChange={e => setQuery(e.target.value)} />
        </Form>



    );
});

export default CustomersFilters;