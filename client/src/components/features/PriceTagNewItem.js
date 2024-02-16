import React, {useContext, useState} from 'react';
import {Alert, Card, Form} from "react-bootstrap";
import {addPriceTag, delAllPriceTags} from "../../http/pricetagAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import ProductSearchFeature from "./ProductSearchFeature";
import Loader from "../../UI/Loader/Loader";
import {Link} from "react-router-dom";

const PriceTagNewItem = observer(() => {
    const {loading} = useContext(Context)
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productId, setProductId] = useState(0);
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    const delAllTags = async() => {
        await delAllPriceTags().then(() => {
            loading.setRefresh(prev => prev+1)
        })
    }

    const addTag = async (e) => {
        e.preventDefault()
        loading.setLoading(true)
        await addPriceTag({Код: productId}).then((data) => {
            if(data?.message?.length>0){
                setAlertMessage({title: '', message: data.message, show: true, variant: 'danger'})
            }
            loading.setLoading(false)
            setProductId(0)
            loading.setRefresh(prev => prev+1)
        })
    }
    if (isLoading) return <Loader />
    return (
        <Card  className="p-2">
            {alertMessage.show &&
                <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                    <Alert.Heading>{alertMessage.title}</Alert.Heading>
                    <p className={'mb-1'}>
                        {alertMessage.message}
                    </p>
                </Alert>
            }
            <div className="d-flex w-100 justify-content-between mb-2">
                <Link to={'/print/price-tags'} target="_blank"><button >ПЕЧАТЬ</button></Link>
                <button style={{padding: "6px 18px"}} onClick={(e) => delAllTags(e)}>УДАЛИТЬ ВСЕ</button>
            </div>
            <Form onSubmit={(e) => addTag(e)}>
                <Form.Control placeholder="Код товара..." value={productId===0 ? '' : productId} onChange={(e) => {
                    setProductId(e.target.value)
                }} />
            </Form>
            <ProductSearchFeature
                setProductId={setProductId}
                productId={productId}
                setIsLoading={setIsLoading}
                setQuery={setQuery}
                query={query}
                formId={1}
                />
            <div className="d-flex justify-content-center mt-2">
                <button disabled={productId===0} onClick={(e) => addTag(e)}>ДОБАВИТЬ</button>
            </div>

        </Card>
    );
});

export default PriceTagNewItem;