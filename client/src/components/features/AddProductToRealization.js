import React, {useContext, useState} from 'react';
import ProductSearchFeature from "./ProductSearchFeature";
import Loader from "../../UI/Loader/Loader";
import {addNewRealization, addNewRealizationItem, updateRealizationPaymentMethod} from "../../http/realizationAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const AddProductToRealization = ({id, setRefresh, disabled, payment, setAlertMessage, refund}) => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productId, setProductId] = useState(0);
    const [barcode, setBarcode] = useState('');
    const addReal = async () => {
        await addNewRealization().then(data => {
            navigate(`/manager/realizations/item/${data.id}`)
        })
    }
    const handlePressEnter = async (e) => {
        if(e.key=== 'Enter'){
            await addItemSearch()
        }
    }
    const handleBarcode = async (e) => {
        if(e.key=== 'Enter'){
            await addNewRealizationItem({
                realizationId: id,
                barcode: barcode
            }).then((data) => {
                if(data?.message){
                    setAlertMessage({title: '', message: data.message, show: true, variant: 'danger'})
                }
                setRefresh(prev => prev+1)
                setBarcode('')
            }).catch(e => {
                setAlertMessage({title: '', message: e.message, show: true, variant: 'danger'})
            })
        }
    }
    if (isLoading) return <Loader />
    const addItemSearch = async () => {
        try {
            await addNewRealizationItem({
                realizationId: id,
                itemId: productId,
                refund
            }).then((data) => {
                if(data?.message){
                    setAlertMessage({title: '', message: data.message, show: true, variant: 'danger'})
                }
                setRefresh(prev => prev+1)
                setProductId(0)
            })
        } catch (e) {
            console.log(e)
            setAlertMessage({title: '', message: e.message, show: true, variant: 'danger'})
        }
    }
    return (
        <div>
            <Form id="AddProductSellsForm" className="w-100 gap-1 d-flex">
                <Form.Control disabled={disabled} onKeyUp={e => handlePressEnter(e)} className="w-50 py-1" type="number" placeholder="Код..." value={productId!==0 ? productId : ''} onChange={e => setProductId(e.target.value)} />
                <Form.Control disabled={disabled} onKeyUp={e => handleBarcode(e)} className="w-50 py-1" type="text" placeholder="Штрихкод..." value={barcode} onChange={e => setBarcode(e.target.value)} />

            </Form>
            <div className="w-100">
                <ProductSearchFeature
                    setIsLoading={setIsLoading}
                    formId={'realization'}
                    disabled={disabled}
                    productId={productId}
                    setProductId={setProductId}
                    query={query}
                    setQuery={setQuery}
                />
                <div className='d-flex justify-content-between mb-2'>
                    <button className="mt-1 py-1 px-4" onClick={() => addReal()}>Новая реализация</button>
                    <button
                        className={payment ? "mt-1 py-1 px-4 paymentMethod card" : "mt-1 py-1 px-4 paymentMethod cash"}
                        onClick={async () =>
                            await updateRealizationPaymentMethod({payment: !payment, realizationId: id})
                                .then(() => {setRefresh(prev => prev+1)})}
                    >{payment ? 'БЕЗНАЛ': 'НАЛИЧКА'}</button>
                    <button disabled={disabled || !productId} className="mt-1 py-1" onClick={() => addItemSearch()}>Добавить товар</button>
                </div>
            </div>
        </div>
    );
};

export default AddProductToRealization;