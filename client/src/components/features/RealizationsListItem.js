import React from 'react';
import {Accordion} from "react-bootstrap";
import {Link} from "react-router-dom";
import Delivery from "../../UI/svgs/delivery";

const RealizationsListItem = ({realization}) => {
    const date = new Date(realization.sellsRemotes[0]['Дата'])
    const totalItems = Math.round(realization.sellsRemotes.reduce((accum, current) => accum + (current.Цена * current.Количество), 0), 0)
    const deliverySum = realization.deliveryId < 1 ? 0 :
        realization.deliveryRemote?.freeSum <= totalItems ? 0 : realization.deliveryRemote?.cost
    const total = totalItems + deliverySum - realization.discount
    return (
        <Accordion.Item eventKey={realization.Счетчик}>
            <Accordion.Header>
                <div className="realizationsListItem">
                    <div>
                        {date.toLocaleString('ru-RU', {timeZone: "Europe/London"})}
                    </div>
                    <div>
                        <b>{realization?.Счетчик}{realization.deliveryId>0 && <span className="mx-2"><Delivery/></span>}</b>
                    </div>
                    <div>
                        <b>{total} ₽</b>
                    </div>
                    <div>
                        {realization?.Проведение
                            ? <span disabled className="realizationsBTN true">ПРОВЕДЕНО</span>
                            : <span disabled className="realizationsBTN false">НЕ ПРОВЕДЕНО</span>
                        }
                    </div>
                    <div>
                        {realization?.Безнал
                            ? <span disabled className="realizationsPaymentBTN true">БЕЗНАЛ</span>
                            : <span disabled className="realizationsPaymentBTN false">НАЛИЧКА</span>
                        }
                    </div>
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex gap-3">
                        <div>Cумма товаров: {totalItems}</div>
                        <div>{realization.discount>0 && `Скидка: ${realization.discount}`}</div>
                        <div>{realization.deliveryId>0 && `Стоимость доставки: ${deliverySum}`}</div>
                    </div>
                    <Link to={`/manager/realizations/item/${realization.Счетчик}`}>
                        <button style={{padding: "6px 16px"}}>Открыть</button>
                    </Link>
                </div>
                {realization.sellsRemotes.length>0 &&
                    realization.sellsRemotes.map(s =>
                        <div className="realizationsSalesItem" key={s.Счетчик}>
                            <div>{s['Код товара']}</div>
                            <div>{s['Наименование']}</div>
                            <div>{s['Цена']}</div>
                            <div>{s['Количество']}</div>
                            <div>{Math.round(s['Цена']*s['Количество'])}</div>
                        </div>
                    )
                }
            </Accordion.Body>
        </Accordion.Item>


    );
};

export default RealizationsListItem;