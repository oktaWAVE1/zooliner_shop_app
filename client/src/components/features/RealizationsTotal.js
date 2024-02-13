import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import CashboxModal from "../modals/cashboxModal";

const RealizationsTotal = observer(() => {
    const {realizations} = useContext(Context)
    const [showModal, setShowModal] = useState(false);
    let salesTotal = 0
    let cardTotal = 0
    let cashTotal = 0
    let deliveryCashTotal = 0
    let deliveryCardTotal = 0

    for (let i=0; i<=realizations.realizations.length-1; i++){
        const curRealization = realizations.realizations[i]
        let saleSum = curRealization.sellsRemotes.reduce((acc, item) => acc + (item.Цена*item.Количество), 0)
        const deliverySum = curRealization.deliveryId < 1 ? 0 :
            curRealization.deliveryRemote?.freeSum <= saleSum ? 0 : curRealization.deliveryRemote?.cost
        salesTotal += saleSum - curRealization.discount + deliverySum
        if(curRealization.Безнал){
            cardTotal += saleSum - curRealization.discount + deliverySum
        } else {
            cashTotal += saleSum - curRealization.discount + deliverySum
        }
        if(curRealization.deliveryId>0 && curRealization.Безнал){
            deliveryCardTotal += saleSum - curRealization.discount + deliverySum
        }
        if(curRealization.deliveryId>0 && !(curRealization.Безнал===true)){
            deliveryCashTotal += saleSum - curRealization.discount + deliverySum
        }
    }


    return (
        <div className="d-flex justify-content-center gap-5 mt-3 align-items-center realizationsTotal pb-2">
            <div>Наличными: {Math.round(cashTotal)} ₽</div>
            <div>Картой: {Math.round(cardTotal)} ₽</div>
            <div><b>Всего: {Math.round(salesTotal)} ₽</b></div>
            <div><button style={{padding: "2px 16px"}} onClick={() => setShowModal(true)}>Касса</button></div>
            <CashboxModal onHide={() => setShowModal(false)}
                          show={showModal}
                          salesTotal={salesTotal}
                          cardTotal={cardTotal}
                          cashTotal={cashTotal}
                          deliveryCashTotal={deliveryCashTotal}
                          deliveryCardTotal={deliveryCardTotal}
            />
        </div>
    );
});

export default RealizationsTotal;