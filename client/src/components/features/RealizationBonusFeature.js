import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import {fetchUserBonus} from "../../http/siteAPI";
import useDebounce from "../../hooks/useDebounce";

const RealizationBonusFeature = ({siteUser, setSiteUser, disabled, setAlertMessage}) => {
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
            fetchUserBonus({userId: siteUser.userId}).then(data => {
                if(data.status===404){
                    setAlertMessage({title: '', message: data.data.message, show: true, variant: 'danger'})
                    setUserBonus({})
                } else {
                    setUserBonus(data.data)
                }
            })
        } else {
            setUserBonus({})
        }
    }, 1000, [siteUser.userId])

    return (
        <div>
            <Form className="w-50 d-flex gap-1">
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
                <button disabled={true} className="py-1 px-2">ПОДТВЕРДИТЬ</button>
                <button disabled={true} className="py-1 px-2">БОНУСЫ</button>
            </Form>
            
        </div>
    );
};

export default RealizationBonusFeature;