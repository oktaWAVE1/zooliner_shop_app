import React, {useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import {fetchSiteOrder, setSiteOrderRead} from "../../http/siteAPI";
import SiteOrderListItem from "../features/SiteOrderListItem";
import SiteOrderInfo from "../features/SiteOrderInfo";
import SiteOrderTotal from "../features/SiteOrderTotal";
import Loader from "../../UI/Loader/Loader";
import {
    addNewRealization,
    addNewRealizationItem,
    updateRealizationDiscount,
    updateRealizationPaymentMethod, updateRealizationSiteCustomer
} from "../../http/realizationAPI";
import {useNavigate} from "react-router-dom";
import {login} from "../../http/userAPI";

const SiteOrderModal = ({show, onHide, id, setRefresh}) => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        if(id){
            setLoading(true)
            fetchSiteOrder({id}).then((data) => {
                setOrder(data)
                setOrderItems(data?.order_items)
                console.log(data)
            }).finally(() => setLoading(false))
        }

    }, [id]);
    const handleRead = async () => {
        await setSiteOrderRead({id}).then(() => {
            setRefresh(prev => prev + 1)
            onHide()
        })
    }

    const handleCreateOrderRealization = async () => {
        setLoading(true)
        await addNewRealization().then(async (data) => {
            const realizationId = data.id
            console.log(realizationId)
            if(order?.paymentMethodId === 1){
                await updateRealizationPaymentMethod({payment: true, realizationId})
            }
            for (let item of orderItems){
                await addNewRealizationItem({
                    realizationId: realizationId,
                    itemId: item.productId,
                    qty: item.qty
                })
            }
            if(order.bonusPointsUsed>0){
                await updateRealizationDiscount({
                    discount: 0,
                    discountDescription: `Использовано ${order.bonusPointsUsed} бонусов`,
                    realizationId
                })
            }
            if(order?.userId>0){
                await updateRealizationSiteCustomer({
                    siteUserId: order.userId,
                    siteOrderId: order.id,
                    bonusPointsUsed: order.bonusPointsUsed,
                    realizationId
                })
            }
            return realizationId
        }).then((realizationId) =>{
            setTimeout(() => {navigate(`/manager/realizations/item/${realizationId}`)}, 1000)
        })
    }

    return (
        <Modal
            className='modal'
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h3>Интернет заказ № {order?.orderNumber}:</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? <Loader /> :
                <div>
                    <div className='d-flex justify-content-between'>
                        <SiteOrderInfo order={order} />
                        <div className="d-flex flex-column gap-2">
                            <button className="px-3 py-1" onClick={() => handleRead()}>Отметить прочитанным</button>
                            <button className="px-3 py-1" onClick={() => handleCreateOrderRealization()}>Создать реализацию</button>
                        </div>
                    </div>
                    {orderItems?.length > 0 &&
                        <div className='siteOrderListHeader mt-3 fw-bold'>
                            <div>Код</div>
                            <div>Наиминование</div>
                            <div className="text-center">Цена</div>
                            <div className="text-center">Кол-во</div>
                            <div className="text-end">Сумма</div>
                        </div>
                    }
                    {orderItems?.length>0 &&
                        orderItems.map(oi =>
                            <SiteOrderListItem key={oi.id} orderItem={oi} />
                        )
                    }

                    <SiteOrderTotal order={order} />
                </div>

                }


            </Modal.Body>
            <Modal.Footer>
                <button onClick={onHide}>Закрыть</button>
            </Modal.Footer>
        </Modal>
    );
};

export default SiteOrderModal;