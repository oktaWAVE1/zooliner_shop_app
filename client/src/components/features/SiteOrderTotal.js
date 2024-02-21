import React from 'react';

const SiteOrderTotal = ({order}) => {
    return (
        <div className="mt-5 fw-bold">
            {order?.bonusPointsUsed > 0 && <div>Бонусов использовано {order?.bonusPointsUsed}</div>}
            <div>Стоимость доставки: {order?.deliverySum}</div>
            <div>Сумма товаров: {order?.salesSum}</div>
            <div>Итого: {order?.salesSum + order?.deliverySum - order?.bonusPointsUsed}</div>
        </div>
    );
};

export default SiteOrderTotal;