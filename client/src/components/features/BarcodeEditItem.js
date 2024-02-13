import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {editBarcode} from "../../http/barcodeAPI";
import {Accordion, Alert, Form} from "react-bootstrap";
import ProductSearchFeature from "./ProductSearchFeature";
import Loader from "../../UI/Loader/Loader";

const BarcodeEditItem = observer(() => {
    const [barcode, setBarcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    const [productId, setProductId] = useState(0);
    const [query, setQuery] = useState('');
    const [accordionKey, setAccordionKey] = useState("1");
    const {products} = useContext(Context)
    const editCurrentBarcode = async () => {
        setIsLoading(true)
        await editBarcode({
            Штрихкод: barcode,
            Код: productId
        })
            .then((res) => {
                if(res.Штрихкод){
                    setAlertMessage({title: '', message: `Штрихкод ${res.Штрихкод} - изменен`, show: true, variant: 'success'})
                    setBarcode('')
                    setQuery('')
                } else {
                    setAlertMessage({title: '', message: res.message, show: true, variant: 'danger'})
                }
            }).finally(() => setIsLoading(false))

    }


    return (
        <Accordion activeKey={accordionKey} className="editBarcodeAccordion mb-3">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => {
                    setAccordionKey(accordionKey==="1" ? "0" : "1")
                    products.setProducts([])
                    setQuery('')
                    setBarcode('')
                    setAlertMessage({title: '', message: '', show: false, variant: 'danger'})
                }}><div className="text-center w-100 headerText"><b>ИЗМЕНИТЬ ШТРИХКОД</b></div></Accordion.Header>
                <Accordion.Body>
                    {alertMessage.show &&
                        <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p className={'mb-1'}>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }
                    {isLoading ? <Loader /> :
                    <>
                        <Form id='editBarcodeForm' className="d-flex flex-column gap-1 justify-content-center">
                            <Form.Control type='text' value={barcode} onChange={e => setBarcode(e.target.value)} placeholder={"Штрихкод..."} />
                        </Form>
                        <ProductSearchFeature setIsLoading={setIsLoading} formId={2} productId={productId} products={products.products} query={query} setQuery={setQuery} setProductId={setProductId} />
                        <div className="d-flex justify-content-center">
                            <button className="mt-2" disabled={barcode.length<10} onClick={() => editCurrentBarcode()}>ИЗМЕНИТЬ</button>
                        </div>
                    </>
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

export default BarcodeEditItem;