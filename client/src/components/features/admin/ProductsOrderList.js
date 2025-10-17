import React, {Suspense, useEffect, useState} from 'react';
import {fetchOrderList, fetchSuppliers} from "../../../http/orderAPI";
import Loader from "../../../UI/Loader/Loader";
import ProductsOrderListItem from "./ProductsOrderListItem";
import {Form} from "react-bootstrap";
import useDebounce from "../../../hooks/useDebounce";
import {useOrderProductsFilter} from "../../../hooks/useOrderProductsFilter";

const ProductsOrderList = () => {
    const [products, setProducts] = useState([])
    const [currentProducts, setCurrentProducts] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentSupplier, setCurrentSupplier] = useState('')
    const [allProducts, setAllProducts] = useState(false)
    useEffect(() => {
        setLoading(true)
        fetchSuppliers().then(data => setSuppliers(data))
        fetchOrderList().then(data => {
            setProducts(data.products)
        }).finally(() => setLoading(false))
    }, []);
    const filteredProducts = useOrderProductsFilter(products, allProducts, currentSupplier)
    useDebounce(() => {
        setCurrentProducts(filteredProducts)
        console.log("filtering")
    }, 200, [products, currentSupplier, allProducts])


    if (loading) return <Loader/>
    return (
        <div>
            {suppliers?.length > 0 &&
                <Form id={"selectSupplierForm"}>
                    <div className="d-flex gap-3 justify-content-start align-items-start">

                        <Form.Select className="mt-1 mb-4 py-1 w-25"
                                     onChange={(e) => setCurrentSupplier(e.target.value)}
                                     value={currentSupplier || "Выберите поставщика"}>
                            <option value={''}>Все поставщики</option>
                            {
                                suppliers.map((s, index) =>
                                    <option key={index} value={s}>
                                        {s}
                                    </option>
                                )
                            }
                        </Form.Select>
                        <Form.Switch checked={allProducts} onChange={() => setAllProducts(!allProducts)}
                                     label="Все товары"/>

                    </div>

                </Form>
            }
            <Suspense>
                {currentProducts?.length > 0 &&
                    currentProducts.map(product =>
                        <ProductsOrderListItem product={product} key={product['Код товара']}/>
                    )
                }
            </Suspense>
        </div>
    );
};

export default ProductsOrderList;