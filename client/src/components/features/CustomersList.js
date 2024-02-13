import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import Loader from "../../UI/Loader/Loader";
import CustomersListItem from "./CustomersListItem";
import ItemsPagination from "./ItemsPagination";

const CustomersList = observer(() => {
    const {customers, loading} = useContext(Context)
    if (loading.loading) return <Loader />
    return (
        <div>
            {customers.currentCustomers.length>0 &&
                customers.currentCustomers.map(c =>
                    <CustomersListItem customer={c} key={c.Код} />
                )
            }
            <div className={"d-flex justify-content-center w-100 mt-3"}>
                <ItemsPagination limit={15} total={customers.filteredCustomers.length} />

            </div>
        </div>
    );
});

export default CustomersList;