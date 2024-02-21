import React from 'react';

const SiteOrderListItem = ({orderItem}) => {
    return (
        <div className="siteOrderListItem">
            <div>{orderItem?.productId}</div>
            <div>{orderItem?.name}</div>
            <div className="text-center">{orderItem?.discountedPrice ? orderItem?.discountedPrice : orderItem?.price}</div>
            <div className="text-center">{orderItem?.qty}</div>
            <div className="text-end">{orderItem?.sum}</div>
        </div>
    );
};

export default SiteOrderListItem;