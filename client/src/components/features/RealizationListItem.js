import React, {useContext, useState} from 'react';
import {Form} from "react-bootstrap";
import {delSellItemFromRealization, updateRealizationItemQty} from "../../http/realizationAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import useDebounce from "../../hooks/useDebounce";

const RealizationListItem = observer(({item, setRefresh}) => {
    const {realizations} = useContext(Context)
    const disabled = realizations.currentRealization?.Проведение
    const [currentItem, setCurrentItem] = useState(item);
    const setNormalizeNumber = (e) => {
        if(e.target.value<1 || !e.target.value) {
            setCurrentItem({...currentItem, Количество: 1})
        } else {
            setCurrentItem({...currentItem, Количество: e.target.value})
        }
    }
    useDebounce(async () => {
        await updateRealizationItemQty({
            itemId: item.Счетчик,
            qty: currentItem.Количество
        }).then(() => setRefresh(prev => prev+1))
    }, 1000, [currentItem.Количество])

    const delCurrentItem = async (e) => {
        e.preventDefault()
        await delSellItemFromRealization({id: item.Счетчик}).then(() => setRefresh(prev => prev + 1))
    }
    return (
        <Form id={`realizationListItem-${item["Код товара"]}`} className="realizationListItem">
            <button disabled={disabled} className="del_btn" onClick={e => delCurrentItem(e)}>X</button>
            <div>{item["Код товара"]}</div>
            <div style={{lineHeight: "16px"}}>{item.Наименование}</div>
            <div>{item.Цена}</div>
            <Form.Control disabled={disabled} className={(currentItem.Количество>item?.productsRemote?.product_in_stock && !disabled)
                ? "exceedsLimit text-center py-0" : "exceedLimit text-center py-0"}
                          type="number"
                          value={currentItem.Количество}
                          onChange={e => setNormalizeNumber(e)} />
            <div><b>{Math.round(currentItem.Количество*item.Цена)} ₽</b></div>
            <div className={(currentItem.Количество>item?.productsRemote?.product_in_stock && !disabled)
                ? "exceedsLimit" : ""}>{item?.productsRemote?.product_in_stock}</div>
        </Form>
    );
});

export default RealizationListItem;