import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {addNewBarcode, editBarcodeExistProduct} from "../../http/barcodeAPI";

const BarcodeListItem = observer(({product, setRefresh, setAlertMessage}) => {
    const [currentBarcode, setCurrentBarcode] = useState('');
    const updateNoBarcode = async (e) => {
        e.preventDefault()
        await editBarcodeExistProduct({
            noBarcode: !product['Нет штрихкода'],
            Код: product.Код
        }).then(() => setRefresh(prev => prev+1))
    }
    const addBarcode = async (e) => {

        e.preventDefault()
        try{

            await addNewBarcode({
                Штрихкод: currentBarcode,
                Код: product.Код
            })
                .then((res) => {
                    if(res.Штрихкод){
                        setRefresh(prev => prev+1)
                    } else if (res.message){
                        setAlertMessage({message: res.message, show: true, variant: 'danger'})
                    }
                })
        } catch (e) {
            setAlertMessage({message: e.response.data.message, show: true, variant: 'danger'})
        }
    }
    return (
        <Form onSubmit={() => {console.log('Штрихкода добавлен')}} className="barcodeListItem mt-1">
            <div>
                {product.Код}
            </div>
            <div>
                {product?.parent?.Код ? `${product.parent.Наименование} ${product.parent['Наименование (крат опис)']}, ${product.Наименование}`
                : `${product.Наименование}, ${product?.['Наименование (крат опис)']}`
                }
            </div>
            <Form.Control type="text" value={currentBarcode} onChange={e => setCurrentBarcode(e.target.value)} placeholder="Штрихкод..." />
            <Form.Check label="нет штрихкода" checked={product['Нет штрихкода']} onChange={e => updateNoBarcode(e)} />
            <button style={{padding: "6px 12px"}} disabled={currentBarcode.length<11} onClick={e => addBarcode(e)}>ОТПАРВИТЬ</button>
        </Form>
    );
});

export default BarcodeListItem;