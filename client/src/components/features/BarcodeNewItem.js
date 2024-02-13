import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Accordion, Alert, Form} from "react-bootstrap";
import {addNewBarcode} from "../../http/barcodeAPI";
import useDebounce from "../../hooks/useDebounce";
import {fetchSearchedProducts} from "../../http/productAPI";
import Loader from "../../UI/Loader/Loader";
import ProductSearchFeature from "./ProductSearchFeature";

const BarcodeNewItem = observer(() => {
    const [newBarcode, setNewBarcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    const [productId, setProductId] = useState(0);
    const [query, setQuery] = useState('');
    const [accordionKey, setAccordionKey] = useState("1");
    const {products} = useContext(Context)
    const addBarcode = async () => {
        setIsLoading(true)
        await addNewBarcode({
            Штрихкод: newBarcode,
            Код: productId
        })
            .then((res) => {
                if(res.Штрихкод){
                    setAlertMessage({title: '', message: `Штрихкод ${res.Штрихкод} - добавлен`, show: true, variant: 'success'})
                    setNewBarcode('')
                    setQuery('')
                } else {
                    setAlertMessage({title: '', message: res.message, show: true, variant: 'danger'})
                }
            }).finally(() => setIsLoading(false))

    }


    return (
        <Accordion activeKey={accordionKey} className="addBarcodeAccordion mb-3">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => {
                    setAccordionKey(accordionKey==="1" ? "0" : "1")
                    products.setProducts([])
                    setQuery('')
                    setNewBarcode('')
                    setAlertMessage({title: '', message: '', show: false, variant: 'danger'})
                }}><div className="text-center w-100"><b>ДОБАВИТЬ ШТРИХКОД</b></div></Accordion.Header>
                <Accordion.Body>
                    {alertMessage.show &&
                        <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p className={'mb-1'}>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }
                    {!isLoading ?
                        <>
                            <Form id='addBarcodeForm' className="d-flex flex-column gap-1 justify-content-center mb-1">
                                <Form.Control type='text' value={newBarcode} onChange={e => setNewBarcode(e.target.value)} placeholder={"Штрихкод..."} />
                            </Form>
                                   <ProductSearchFeature setIsLoading={setIsLoading} formId={1} productId={productId} products={products.products} query={query} setQuery={setQuery} setProductId={setProductId} />
                            <div className="d-flex justify-content-center">
                                <button className="mt-2 w-100" disabled={newBarcode.length<10 || String(productId)==='0'} onClick={() => addBarcode()}>ДОБАВИТЬ</button>
                            </div>
                        </> :
                        <Loader />
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

export default BarcodeNewItem;