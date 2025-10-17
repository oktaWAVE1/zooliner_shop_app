import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import {deleteInvoiceItem, updateInvoiceItemPriceQTY} from "../../../http/invoiceAPI";
import useDebounce from "../../../hooks/useDebounce";

const NewInvoiceItem = ({item, index, setRefresh, writeChanges, writeDeliveryCost}) => {
    const [currentItem, setCurrentItem] = useState(item)
    const [currentSum, setCurrentSum] = useState(0)
    const handleDeleteItem = async (e) => {
        e.preventDefault();
        await deleteInvoiceItem({Счетчик: item.Счетчик}).then(() => setRefresh(prev => prev + 1));
    }

    const calculateItemPrice = async (e) => {
        e.preventDefault()
        if (currentItem.Количество>0){
            setCurrentItem({...currentItem, Цена: e.target.value/currentItem.Количество})
        }
        setCurrentSum(e.target.value)
    }


    const handleUpdateItem = async () => {
        await updateInvoiceItemPriceQTY({
            Счетчик: item.Счетчик,
            Цена: currentItem.Цена,
            Количество: currentItem.Количество
        }).then()
    }

    useDebounce(async () => {
        await handleUpdateItem()
    }, 100, [writeChanges])

    useDebounce(() => {
        if (writeDeliveryCost.interest) {
            setCurrentItem({...currentItem, Цена: (currentItem.Цена * (writeDeliveryCost.interest + 1))})

        }
    }, 100, [writeDeliveryCost])


    return (
        <Form id={`line ${item.Счетчик}`} className="new-invoice-item" onSubmit={e => e.preventDefault()}>
            <div>{index}.</div>
            <div title="Код">{item.Код}</div>
            <div title="Наименование">{item.Наименование}</div>
            <div className="text-center" title="Артикул">{item['Артикул поставщика']}</div>
            <Form.Control autoComplete={"off"} disabled={currentItem.Проведен} name={'price'} className="text-center" type="number"
                          value={currentItem.Цена}
                          onChange={e => setCurrentItem({...currentItem, Цена: e.target.value})} title="Цена закупа"/>
            <Form.Control step={1} min={0} max={10000000} type="number" autoComplete={"off"}
                          disabled={currentItem.Проведен} name={'qty'} className="text-center"
                          value={currentItem.Количество}
                          onChange={e => setCurrentItem({...currentItem, Количество: e.target.value})}
                          title="Количество"/>
            <Form.Control  type="number" autoComplete={"off"}
                          disabled={currentItem.Проведен} name={'qty'} className="text-center"
                          value={currentSum}
                          onChange={e => calculateItemPrice(e)}
                          title="Сумма для расчета"/>
            <div className="text-center" title="Сумма закупа">
                <strong>{(item.Цена * item.Количество).toFixed(2)}</strong></div>
            <button disabled={item.Проведен} tabIndex={-1} className={"pointer px-1 py-1 border-0"} type={'button'}
                    onClick={e => handleDeleteItem(e)}>x
            </button>
        </Form>
    );
};

export default NewInvoiceItem;