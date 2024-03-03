import React, {useEffect, useState} from 'react';
import {fetchStockProducts} from "../../http/productAPI";
import {useSearchParams} from "react-router-dom";
import Loader from "../../UI/Loader/Loader";

const ProductInStockList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams()
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    useEffect(() => {
        setLoading(true)
        fetchStockProducts({brand, category}).then(data => setProducts(data)).finally(() => {
            setLoading(false)
            setTimeout(() => window.print(), 1000)
        })
    }, []);
    if(loading) return <Loader />
    return (
        <div className="printStockByBrand">
            {products.length>0 &&
                products.sort((a,b) => a?.title.toLowerCase().localeCompare(b?.title.toLowerCase())).map(p =>
                    <div className="printStockByBrandItem" key={p.id}>
                        <div>{p.id}</div>
                        <div>{p.title}</div>
                        <div>{p.stock}</div>
                        <div></div>
                    </div>
                )
            }
        </div>
    );
};

export default ProductInStockList;