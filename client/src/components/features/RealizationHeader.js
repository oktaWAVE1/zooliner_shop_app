import React, {useContext, useEffect, useState} from 'react';
import CountChangeFeature from "./CountChangeFeature";
import {Context} from "../../index";
import CountWeightFeature from "./CountWeightFeature";
import {
    confirmCurrentRealization,
    fetchDeliveryMethods,
    fetchRealization,
    updateRealizationDeliveryMethod, updateRealizationType,
    updateRealizationUser
} from "../../http/realizationAPI";
import AddProductToRealization from "./AddProductToRealization";
import DeliveryMethodsFeature from "./DeliveryMethodsFeature";
import RealizationTotalFeature from "./RealizationTotalFeature";
import useDebounce from "../../hooks/useDebounce";
import RealizationCustomerFeature from "./RealizationCustomerFeature";
import RealizationDiscountFeature from "./RealizationDiscountFeature";
import RealizationDate from "./RealizationDate";
import {Alert} from "react-bootstrap";
import PopularProductsModal from "../modals/popularProductsModal";
import RealizationBonusFeature from "./RealizationBonusFeature";

const RealizationHeader = ({id, refresh, setRefresh}) => {
    const {realizations, loading} = useContext(Context)
    const [extraProducts, setExtraProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [total, setTotal] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [discount, setDiscount] = useState({sum: 0, description: ''});
    const [currentCustomer, setCurrentCustomer] = useState(0);
    const [currentDeliveryMethod, setCurrentDeliveryMethod] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [date, setDate] = useState('');
    const [refund, setRefund] = useState(false);
    const [siteUser, setSiteUser] = useState({userId: 0, bonusPointsUsed: 0});
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    const [finalTotal, setFinalTotal] = useState(0);
    const setDeliveryMethod = async (e) => {
        e.preventDefault()
        await updateRealizationDeliveryMethod({
            deliveryId: e.target.value,
            realizationId: id
        }).then(setRefresh(prev => prev +1))
    }
    useDebounce(async () => {
        await updateRealizationUser({userId: currentCustomer, realizationId: id}).then(setRefresh(prev => prev +1))
    }, 50, [currentCustomer])

    const updateRefundStatus = async () => {
        await updateRealizationType({
            realizationId: id,
            refund: !refund
        }).then(setRefresh(prev => prev +1))
    }


    const fetchCurrent = async () => {
        loading.setLoading(true)
        await fetchRealization({id}).then(data => {
            realizations.setRealizationItems([...data.sellsRemotes].sort((a,b) => a.Счетчик-b.Счетчик))
            realizations.setCurrentRealization(data)
            const itemsTotal = data.sellsRemotes.reduce((accum, item) => {
                return accum + (item.Цена * item.Количество)
            }, 0)
            const discountedTotal = itemsTotal-data?.discount
            setTotal(itemsTotal)
            if(discountedTotal < data?.deliveryRemote?.freeSum) {
                setDeliveryCost(data?.deliveryRemote.cost)
            } else {
                setDeliveryCost(0)

            }
            setDate('')
            setRefund(data.refund)
            setSiteUser({userId: data.siteUserId || 0, bonusPointsUsed: data.bonusPointsUsed || 0})
            setCurrentDeliveryMethod(data.deliveryId || 0)
            setCurrentCustomer(data.userId || 0)
            setPaymentMethod(data.Безнал)
            setDiscount({sum: data.discount || 0, description: data.discountDescription || ''})
        }).finally(() => {
            loading.setLoading(false)
        })
    }
    useEffect(() => {
        fetchCurrent()
    }, [id]);

    useDebounce(async ()=> {
        fetchCurrent()
    }, 500, [refresh])
    useDebounce(() => {

        setFinalTotal(total-discount.sum+deliveryCost)
    }, 0, [total, discount.sum, deliveryCost])


    return (
        <div>
            {alertMessage.show &&
                <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                    <Alert.Heading>{alertMessage.title}</Alert.Heading>
                    <div className={'mb-1'}>
                        {alertMessage.message}
                        {extraProducts.length > 0 &&
                            extraProducts.map((ep, index) =>
                                <div key={index} className='d-flex gap-3'>
                                    <div>{ep.id}</div>
                                    <div>{ep.name}</div>
                                    <div>Лишнее количество: {ep.extraQTY}</div>
                                    <div><b>Сумма: {ep.extraQTY*ep.price}</b></div>
                                </div>
                            )
                        }
                    </div>
                </Alert>
            }
            <PopularProductsModal disabled={realizations.currentRealization.Проведение} id={id} setRefresh={setRefresh} show={showModal} onHide={() => setShowModal(false)} />
            <div className="w-100 d-flex gap-4">
                <div className="w-50">
                    <div style={{height: "34px"}} className='d-flex gap-3 mb-1 justify-content-between'>
                        <CountChangeFeature refresh={refresh} total={finalTotal} />
                        <RealizationDate date={date} setDate={setDate} disabled={realizations.currentRealization.Проведение} />
                    </div>
                    <div style={{height: "34px"}} className='d-flex gap-3 mb-1 justify-content-between'>
                        <CountWeightFeature refresh={refresh} />
                        <button className="p-1" onClick={() => setShowModal(true)}>ПОПУЛЯРНЫЕ ТОВАРЫ</button>
                    </div>
                    <div className='d-flex w-100 gap-1'>
                        <DeliveryMethodsFeature
                            currentDeliveryMethod={currentDeliveryMethod}
                            setDeliveryMethod={setDeliveryMethod}
                            />
                        <RealizationCustomerFeature refresh={refresh} currentCustomer={currentCustomer} setCurrentCustomer={setCurrentCustomer} />
                    </div>
                    <RealizationDiscountFeature setRefresh={setRefresh} id={id} discount={discount} setDiscount={setDiscount} />
                </div>
                <div className="w-50">
                    <AddProductToRealization refund={refund} setAlertMessage={setAlertMessage} payment={paymentMethod} setRefresh={setRefresh} disabled={realizations.currentRealization.Проведение} id={id} />
                </div>
            </div>
            <div className="d-flex w-50 gap-1">
                <RealizationBonusFeature realizationId={id} setAlertMessage={setAlertMessage} disabled={realizations.currentRealization.Проведение} siteUser={siteUser} setSiteUser={setSiteUser} />
                <button
                    onClick={() => updateRefundStatus()}
                    disabled={realizations.currentRealization.Проведение}
                    className={refund ? "py-1 px-2 btn_refund refund" : "py-1 px-2 btn_refund realization"}
                >ВОЗВРАТ</button>
            </div>
            <RealizationTotalFeature date={date} setExtraProducts={setExtraProducts} setAlertMessage={setAlertMessage} setRefresh={setRefresh} disabled={realizations.currentRealization.Проведение} id={id} realizationDone={realizations.currentRealization.Проведение} total={total} discount={realizations.currentRealization.discount} delivery={deliveryCost} siteUser={siteUser} />
        </div>
    );
};

export default RealizationHeader;