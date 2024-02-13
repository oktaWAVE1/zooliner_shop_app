import React, {useEffect, useState} from 'react';
import {fetchBrands} from "../../http/brandAPI";
import {Form} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [brand, setBrand] = useState('0');
    useEffect(() => {
        fetchBrands().then(data => setBrands(data))
    }, []);

    return (
        <Form id='BrandSelectForm' className="mt-1">
            <Form.Select disabled={brands.length===0} className="mt-1" onChange={(e) => {
                setBrand(e.target.value)
            }} value={brand}>
                <option value={'0'}>Производитель</option>
                {brands?.length > 0 &&
                    brands.sort((a, b) => a["Название производителя"].toLowerCase().localeCompare(b["Название производителя"].toLowerCase())).map(brand =>
                        <option key={brand.id_производителя} value={brand.id_производителя}>
                            {brand["Название производителя"]}
                        </option>
                    )
                }


            </Form.Select>
            {brand!=='0' &&
                <div className="w-100 d-flex justify-content-center mt-3">
                    <Link style={{textDecoration: "none"}} to={`/print/brand-stocks/${brand}`} target="_blank">
                        <span className="myBtn">РАСПЕЧАТАТЬ ТЕКУЩИЕ ОСТАТКИ</span>
                    </Link>
                </div>
            }
        </Form>
    );
};

export default BrandList;