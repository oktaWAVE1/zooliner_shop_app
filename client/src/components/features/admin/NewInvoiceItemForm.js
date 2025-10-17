import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import {addInvoiceItemsByBarcodeList, addInvoiceItemsById, addInvoiceItemsBySKUList} from "../../../http/invoiceAPI";
import ProductSearchFeature from "../ProductSearchFeature";
import Loader from "../../../UI/Loader/Loader";
import {fetchSKUList} from "../../../http/productAPI";

const NewInvoiceItemForm = ({invoiceName, supplier, setRefresh, deliveryCost, setDeliveryCost, handleAddDeliveryCost}) => {
    useEffect(() => {
        fetchSKUList().then(data => {
            setFullSKUList(data)
        })
    }, []);
    const [fullSKUList, setFullSKUList] = useState([])
    const [SKUFilter, setSKUFilter] = useState('')
    const [barcodeList, setBarcodeList] = useState('')
    const [SKUList, setSKUList] = useState('')
    const [productId, setProductId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const handleAddBarcodeList = async (e) => {
        e.preventDefault()
        if(barcodeList?.length > 0){
            await addInvoiceItemsByBarcodeList({barcodeList, invoiceName, supplier}).then(data => {
                if(data?.failedCounter>0){
                    alert(`Не было добавлено ${data?.failedCounter} позиций`)
                }
                setRefresh(prev => prev+1)
                setBarcodeList('')
            })
        }
    }
    const handleAddSKUList = async (e) => {
        e.preventDefault()
        if(SKUList?.length > 0){
            await addInvoiceItemsBySKUList({SKUList, invoiceName, supplier}).then(data => {
                if(data?.failedCounter>0){
                    alert(`Не было добавлено ${data?.failedCounter} позиций`)
                }
                setRefresh(prev => prev+1)
                setSKUList('')
            })
        }
    }
    const handleAddById = async (e) => {
        e.preventDefault()
        if(productId > 0){
            await addInvoiceItemsById({Код: productId, invoiceName, supplier}).then(() => {
                setRefresh(prev => prev+1)
                setProductId(0)
            })
        }
    }




    return (
        <div className="mb-3">
            <Form id={"newInvoiceItemForm"} onSubmit={e => e.preventDefault()}>
                <div className="d-flex gap-3 justify-content-between">
                    <div className="d-flex align-items-end gap-1">
                        <textarea placeholder="Список штрихкодов..." value={barcodeList} style={{height:'100%',width:'100%'}}
                                  disabled={invoiceName?.length < 5 || !supplier}
                                  onChange={e => setBarcodeList(e.target.value)}/>
                        <button disabled={invoiceName?.length < 5 || !supplier || barcodeList?.length<1} className="px-2 py-1" type="button" onClick={(e) => handleAddBarcodeList(e)}>Отправить
                        </button>
                    </div>
                    {isLoading &&
                        <div style={{position: "absolute", left: "50%", transform: "translate(-50%, -50%)", top: "50%"}}>
                            <Loader />
                        </div>
                    }
                    <div className="d-flex flex-column">
                        <Form.Control placeholder='Добавить по коду' type="number" value={productId ? productId : ''} onChange={e => setProductId(e.target.value)} />
                        <button className="py-1" onClick={e => handleAddById(e)} disabled={invoiceName?.length < 5 || !supplier || !productId || productId<1} type="button">Добавить</button>
                    </div>
                    <div className="d-flex flex-column">
                        <Form.Control value={SKUFilter} onChange={e => setSKUFilter(e.target.value)} />
                        <Form.Select className="mt-0 mb-0 py-1 w-100"
                                     isSearchable={true}
                                     onChange={(e) => setProductId(e.target.value)}
                                     value={productId || "Введите артикул"}>
                            <option value={''}>Артикулы</option>
                            {
                                fullSKUList.filter(SKU => SKU.SKU.toLowerCase().startsWith(SKUFilter.toLowerCase())).map((SKU) =>
                                    <option key={SKU['Код']} value={SKU['Код']}>
                                        {SKU['SKU']}
                                    </option>
                                )
                            }
                        </Form.Select>
                    </div>
                    <div className="d-flex align-items-end gap-1">
                        <textarea placeholder="Список артикулов..." value={SKUList} style={{height:'100%',width:'100%'}}
                                  disabled={invoiceName?.length < 5 || !supplier}
                                  onChange={e => setSKUList(e.target.value)}/>
                        <button disabled={invoiceName?.length < 5 || !supplier || SKUList?.length<1} className="px-2 py-1" type="button" onClick={(e) => handleAddSKUList(e)}>Отправить</button>
                    </div>

                </div>
            </Form>
            <div>
                <div className='w-100 d-flex justify-content-between gap-2 mt-1'>
                    <div className="w-75">
                        <ProductSearchFeature query={searchQuery} setQuery={setSearchQuery} formId={'invoiceProductSearchForm'} setProductId={setProductId} productId={productId} setIsLoading={setIsLoading} disabled={invoiceName?.length < 5 || !supplier || isLoading}/>
                    </div>
                    <Form id={'addDeliveryCost'} className='w-25 d-flex flex-column'>
                        <Form.Control type={"number"} placeholder="Стоимость доставки" value={deliveryCost ? deliveryCost : ""} onChange={e => setDeliveryCost(e.target.value)} />
                        <button type={"button"} disabled={!deliveryCost} onClick={e => handleAddDeliveryCost(e)} className="py-1 px-2 mt-1" >Добавить доставку</button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default NewInvoiceItemForm;