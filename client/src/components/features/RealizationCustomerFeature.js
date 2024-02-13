import React from 'react';
import CustomersFilters from "./CustomersFilters";
import RealizationCustomerList from "./RealizationCustomerList";

const RealizationCustomerFeature = ({currentCustomer, setCurrentCustomer, refresh}) => {
    return (
        <div className='d-flex mt-1 w-75 gap-1'>
            <div style={{width: '200px'}}>
                <RealizationCustomerList className="py-1" currentCustomer={currentCustomer} setCurrentCustomer={setCurrentCustomer} />
            </div>
            <div style={{width: '220px'}}>
                <CustomersFilters refresh={refresh} />
            </div>
        </div>
    );
};

export default RealizationCustomerFeature;