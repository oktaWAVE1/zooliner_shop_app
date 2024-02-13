import React, {useEffect, useState} from 'react';
import {fetchStockProductsByBrand} from "../../http/productAPI";
import {useParams} from "react-router-dom";

const ProductInStockBrandList = () => {
    const [products, setProducts] = useState([]);
    const {id} = useParams()
    useEffect(() => {
        fetchStockProductsByBrand({id}).then(data => setProducts(data)).finally(() => setTimeout(() => window.print(), 1000))
    }, []);
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

export default ProductInStockBrandList;