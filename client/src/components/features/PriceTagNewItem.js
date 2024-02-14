import React, {useContext, useState} from 'react';
import {Card, Form} from "react-bootstrap";
import {addPriceTag, delAllPriceTags} from "../../http/pricetagAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import ProductSearchFeature from "./ProductSearchFeature";
import Loader from "../../UI/Loader/Loader";
import {Link, useNavigate} from "react-router-dom";

const PriceTagNewItem = observer(() => {
    const {loading} = useContext(Context)
    const navigate = useNavigate()
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productId, setProductId] = useState(0);
    const delAllTags = async() => {
        await delAllPriceTags().then(() => {
            loading.setRefresh(prev => prev+1)
        })
    }

    const addTag = async () => {
        loading.setLoading(true)
        await addPriceTag({Код: productId}).then(() => {
            loading.setLoading(false)
            setProductId(0)
            loading.setRefresh(prev => prev+1)
        })
    }
    if (isLoading) return <Loader />
    return (
        <Card  className="p-2">
            <div className="d-flex w-100 justify-content-between mb-2">
                <Link to={'/print/price-tags'} target="_blank"><button >ПЕЧАТЬ</button></Link>
                <button style={{padding: "6px 18px"}} onClick={() => delAllTags()}>УДАЛИТЬ ВСЕ</button>
            </div>
            <Form onSubmit={() => addTag()}>
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
                <button disabled={productId===0} onClick={() => addTag()}>ДОБАВИТЬ</button>
            </div>

        </Card>
    );
});

export default PriceTagNewItem;