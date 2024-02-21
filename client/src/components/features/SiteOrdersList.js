import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import SiteOrderModal from "../modals/siteOrderModal";
import useDebounce from "../../hooks/useDebounce";
import {fetchUnreadSiteOrders} from "../../http/siteAPI";
import TodayDeliveryList from "./TodayDeliveryList";

const SiteOrdersList = observer(() => {
    const {siteOrders} = useContext(Context)
    const [currentId, setCurrentId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(0);
    useEffect(() => {
        fetchUnreadSiteOrders().then(data => siteOrders.setSiteOrders(data))
    }, []);
    useDebounce(async () => {
        await fetchUnreadSiteOrders().then(data => siteOrders.setSiteOrders(data))
    }, 50, [refresh])
    return (
        <div>
            <TodayDeliveryList />
            <SiteOrderModal id={currentId} onHide={() => setShowModal(false)} show={showModal} setRefresh={setRefresh} />
            {siteOrders.siteOrders?.length > 0 &&
                siteOrders.siteOrders.map(so =>
                <div className="siteOrdersItem" onClick={() => {
                    setCurrentId(so.id)
                    setShowModal(true)
                }} key={so.id}>
                    <div>{so.orderNumber}</div>
                    <div>{so.customerName}</div>
                    <div>{so.customerTel}</div>
                    <div>{so.orderAddress}</div>
                    <div>{so.salesSum} ₽</div>
                </div>
                )
            }
            
        </div>
    );
});

export default SiteOrdersList;