import React, {useContext} from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import useDebounce from "../../hooks/useDebounce";
import {fetchSearchedProducts} from "../../http/productAPI";

const ProductSearchFeature = observer(({setIsLoading, formId, productId, setProductId, query, setQuery, disabled}) => {
    const {products} = useContext(Context)
    useDebounce(async () => {
        if(query.length>0){
            setIsLoading(true)
            await fetchSearchedProducts({query}).then(data => {
                products.setProducts(data)
            }).finally(() => setIsLoading(false))
        } else {
            products.setProducts([])
        }
    }, 2000, [query])
    useDebounce(() => setProductId(0), 50, [query])
    return (
        <Form id={`ProductSearchForm-${formId}`} className="mt-1">
            <Form.Control className="py-1" disabled={disabled} type='text' value={query} onChange={e => setQuery(e.target.value)} placeholder={"Поиск товара..."} />
            <Form.Select  disabled={products.products.length===0 || query.length===0} className="mt-1 py-1" onChange={(e) => {
                setProductId(e.target.value)
            }} value={productId}>
                <option value={'0'}>Товар</option>
                {products.products?.length > 0 &&
                    products.products.filter(p => (!p.children || p?.children.length === 0) && !(p.Наименование?.toLowerCase().includes('удален'))).map(p =>
                        <option key={p.Код} value={p.Код}>
                            {p.Наименование}, {p['Наименование (крат опис)']}
                        </option>
                    )
                }
                {products.products &&
                        products.products.filter(p => !(p.Наименование?.toLowerCase().includes('удален'))).map(p =>
                            p.children.filter(pc => pc.Наименование!=="развес 100 г." ).map(pc =>
                                <option key={pc.Код} value={pc.Код}>
                                    {p.Наименование}, {p['Наименование (крат опис)']}, {pc.Наименование}
                                </option>
                            )
                        )
                }
            </Form.Select>

        </Form>
    );
});

export default ProductSearchFeature;