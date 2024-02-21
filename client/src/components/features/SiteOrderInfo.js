import React from 'react';

const SiteOrderInfo = ({order}) => {
    return (
        <div>
            <div>Клиент: {order?.customerName}</div>
            <div>Код клиента: {order?.userId}</div>
            <div>Телефон: {order?.customerTel}</div>
            <div>Адрес: {order?.orderAddress}</div>
            <div>Способ оплаты: {order?.payment_method?.name}</div>
            <div>Способ доставки: {order?.delivery_method?.name}</div>

        </div>
    );
};

export default SiteOrderInfo;