import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import {fetchUserBonus} from "../../http/siteAPI";
import useDebounce from "../../hooks/useDebounce";
import {updateRealizationSiteCustomer} from "../../http/realizationAPI";

const RealizationBonusFeature = ({siteUser, setSiteUser, disabled, setAlertMessage, realizationId}) => {
    const [userBonus, setUserBonus] = useState({});
    const setQTY = (e) => {
        if(e.target.value<0){
            setSiteUser({...siteUser, bonusPointsUsed: 0})
        } else if(e.target.value>(userBonus.currentQty+userBonus.frozenPoints)){
            setSiteUser({...siteUser, bonusPointsUsed: Math.floor(userBonus.currentQty+userBonus.frozenPoints)})
        } else {
            setSiteUser({...siteUser, bonusPointsUsed: e.target.value})
        }
    }

    useEffect(() => {
        if(siteUser.userId){
            fetchUserBonus({userId: siteUser.userId}).then(data => {
                console.log(data)
                if(data.status===404){
                    setAlertMessage({title: '', message: data.data.message, show: true, variant: 'danger'})
                    setUserBonus({})
                } else {
                    setUserBonus(data.data)
                }

            })
        }
    }, []);

    useDebounce(async () => {
        if(siteUser.userId){
            fetchUserBonus({userId: siteUser.userId}).then(async(data) => {
                if(data.status===404){
                    setAlertMessage({title: '', message: data.data.message, show: true, variant: 'danger'})
                    setUserBonus({})
                } else {
                   await updateRealizationSiteCustomer({
                       siteUserId: siteUser.userId,
                       bonusPointsUsed: siteUser.bonusPointsUsed,
                       realizationId
                   })
                    setUserBonus(data.data)
                }
            })
        } else {
            setUserBonus({})
        }
    }, 1000, [siteUser.userId, siteUser.bonusPointsUsed])

    return (
        <div>
            <Form className="w-100 d-flex gap-1">
                <Form.Control className="py-1 w-25"
                              disabled={disabled} type='number'
                              placeholder="QR..."
                              value={String(siteUser.userId)==='0' ? '' : siteUser.userId}
                              onChange={e => setSiteUser({...siteUser, userId: e.target.value})} />
                <Form.Control className="py-1"
                              disabled={disabled || !(userBonus?.id)} type='number'
                              placeholder={!userBonus?.id ? "Бонусов использовано..." : `Доступно: ${userBonus.currentQty}. Заморожено: ${userBonus.frozenPoints}`}
                              value={String(siteUser.bonusPointsUsed)==='0' ? '' : siteUser.bonusPointsUsed}
                              onChange={e => setQTY(e)} />
            </Form>
            
        </div>
    );
};

export default RealizationBonusFeature;