import React, {useContext} from 'react';
import {confirmCurrentRealization} from "../../http/realizationAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Link} from "react-router-dom";

const RealizationTotalFeature = observer(({total, discount, delivery, realizationDone, id, disabled, setRefresh, setAlertMessage, setExtraProducts}) => {
    const discountedTotal = total - discount + delivery
    const {loading} = useContext(Context)
    const confirmRealization = async () => {
        loading.setLoading(true)
        await confirmCurrentRealization({id}).then((data) => {
            if(data?.status==='extra products'){
                setExtraProducts(data.extraProducts)
                setAlertMessage({title: 'Товар не числится на складе:', message: '', show: true, variant: 'danger'})
            }
            setRefresh(prev => prev + 1)
        })
    }
    return (
        <div className="d-flex w-100 justify-content-between realizationTotal mt-2">
            <div className='d-flex gap-3'>
                <div className={realizationDone ? 'realization done' : 'realization'}>{realizationDone ? 'ПРОВЕДЕНО' : 'НЕ ПРОВЕДЕНО'}</div>
                <button disabled={disabled || loading.loading} onClick={() => confirmRealization()}>ПРОВЕСТИ</button>
                <Link to={`/print/order/${id}`} target="_blank"><button className="px-2">ЧЕК</button></Link>
            </div>
            <div className="d-flex gap-3 w-auto mt-3 justify-content-end realizationTotalSums">
                <div>{delivery>0 && `Стоимость доставки: ${delivery} ₽`}</div>
                <div>{discount>0 && `Скидка: ${discount} ₽`}</div>
                <div>{total !== discountedTotal && `Стоимость товара: ${Math.ceil(total)} ₽`}</div>
                <div style={{color: "darkred"}}>Итого: {Math.ceil(discountedTotal)} ₽</div>
            </div>
        </div>
    );
});

export default RealizationTotalFeature;