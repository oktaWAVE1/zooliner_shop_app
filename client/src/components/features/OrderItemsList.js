import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {fetchRealization} from "../../http/realizationAPI";
import {Container} from "react-bootstrap";

const OrderItemsList = () => {
    const {id} = useParams()
    const date = new Date
    const [items, setItems] = useState([]);
    const [realization, setRealization] = useState({});
    const [total, setTotal] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    useEffect(() => {
        fetchRealization({id}).then(data => {
            setItems([...data.sellsRemotes].sort((a,b) => a.Счетчик-b.Счетчик))
            setRealization(data)
            const itemsTotal = data.sellsRemotes.reduce((accum, item) => {
                return accum + (item.Цена * item.Количество)
            }, 0)
            const discountedTotal = itemsTotal-data?.discount
            setTotal(itemsTotal)
            if(discountedTotal <= data?.deliveryRemote?.freeSum) {
                setDeliveryCost(data?.deliveryRemote.cost)
            } else {
                setDeliveryCost(0)
            }
    }).finally(() => {
            setTimeout(() => {
                window.print()
            }, 1000)
        })}, []);

    return (
        <div className="w-100 px-3 mt-3 orderPrintItems">
            <div>Клиент: {realization?.customersRemote?.Имя}</div>
            <div>Адрес: {realization?.customersRemote?.Адрес}</div>
            <div>Телефон: {realization?.customersRemote?.Телефон}</div>
            <div>Способ оплаты: {realization?.Безнал ? "безналичный" : "наличный"}</div>

            <h3 className="text-center mt-3 mb-3">Товарный чек № {id} от {date.toLocaleDateString()}</h3>
            <div>
                <div className="orderHeader">
                    <div></div>
                    <div>Наименование</div>
                    <div className="text-center">Цена</div>
                    <div className="text-center">Количество</div>
                    <div className="text-end">Сумма</div>
                </div>
                <div className="mt-2">
                    {items?.length > 0 &&
                        items.map((i, index) =>
                        <div className="orderItem" key={i.Счетчик}>
                            <div>{index+1}.</div>
                            <div>{i.Наименование}</div>
                            <div className="text-center">{i.Цена}</div>
                            <div className="text-center">{i.Количество}</div>
                            <div className="text-end">{Math.round(i.Цена*i.Количество)}</div>
                        </div>
                        )
                    }
                </div>
            </div>

            <div className="mt-5 total">
                <div>Итого товаров на сумму: {Math.ceil(total)}</div>
                <div>{realization?.deliveryId>0 && `Стоимость доставки: ${deliveryCost}`}</div>
                <div>{(realization+realization.bonusPointsUsed)?.discount>0 && `Скидка: ${realization.discount+realization.bonusPointsUsed}`}</div>
                <div>{realization?.discountDescription?.length>0 && `Комментарий: ${realization.discountDescription}`}</div>
                <div style={{fontWeight: "800"}}>Итого: {Math.ceil(total-realization?.discount+deliveryCost-realization.bonusPointsUsed)}</div>

            </div>
        </div>
    );
};

export default OrderItemsList;