import React from 'react';

const SiteOrderInfo = ({order}) => {
    console.log(order)
    return (
        <div>
            <div>Клиент: {order?.customerName}</div>
            <div>Код клиента: {order?.userId}</div>
            <div>Телефон: {order?.customerTel}</div>
            <div>Адрес: {order?.orderAddress}</div>
            <div>Способ оплаты: {order?.payment_method?.name}</div>
            <div>Способ доставки: {order?.delivery_method?.name}</div>
            <div>Комментарий: <span style={{fontWeight: 800}}>{order?.comment}</span></div>

        </div>
    );
};

export default SiteOrderInfo;