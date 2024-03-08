import React, {useContext} from 'react';
import {confirmCurrentRealization} from "../../http/realizationAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Link} from "react-router-dom";

const RealizationTotalFeature = observer(({total, discount, date, delivery, realizationDone, id, disabled, setRefresh, setAlertMessage, setExtraProducts, siteUser}) => {
    const discountedTotal = total - discount + delivery - Number(siteUser.bonusPointsUsed)
    const {loading, realizations} = useContext(Context)
    const confirmRealization = async () => {
        loading.setLoading(true)
        await confirmCurrentRealization({id, date}).then((data) => {
            if(data?.status==='extra products'){
                setExtraProducts(data.extraProducts)
                setAlertMessage({title: 'Товар не числится на складе:', message: '', show: true, variant: 'danger'})
            }
            setRefresh(prev => prev + 1)
        })
    }
    return (
        <div className="d-flex w-100 justify-content-between realizationTotal my-2">
            <div className='d-flex gap-3'>
                <div className={realizationDone ? 'realization done' : 'realization'}>{realizationDone ? 'ПРОВЕДЕНО' : 'НЕ ПРОВЕДЕНО'}</div>
                <button disabled={disabled || loading.loading || realizations.realizationItems.length===0} onClick={() => confirmRealization()}>ПРОВЕСТИ</button>
                <Link to={`/print/order/${id}`} target="_blank"><button className="px-2">ЧЕК</button></Link>
            </div>
            <div className="d-flex gap-3 w-auto mt-3 justify-content-end realizationTotalSums">
                <div>{delivery>0 && `Стоимость доставки: ${delivery} ₽`}</div>
                <div>{(discount+siteUser.bonusPointsUsed)>0 && `Скидка: ${(discount+Number(siteUser.bonusPointsUsed))} ₽`}</div>
                <div>{total !== discountedTotal && `Стоимость товара: ${Math.floor(total)} ₽`}</div>
                <div style={{color: "darkred"}}>Итого: {Math.floor(discountedTotal)} ₽</div>
            </div>
        </div>
    );
});

export default RealizationTotalFeature;