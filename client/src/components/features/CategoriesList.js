import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {fetchSiteCategories} from "../../http/siteAPI";

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('0');
    useEffect(() => {
        fetchSiteCategories().then(data => {
            setCategories(data)
            console.log(data)
        })
    }, []);

    return (
        <Form id='CategorySelectForm' className="mt-1">
            <Form.Select disabled={categories.length===0} className="mt-1" onChange={(e) => {
                setCategory(e.target.value)
            }} value={category}>
                <option value={'0'}>Категория</option>
                {categories?.length > 0 &&
                    categories.filter(c => c.categoryId>0 || c.id===-1)
                        .sort((a, b) => a?.name.toLowerCase().localeCompare(b?.name.toLowerCase()))
                        .sort((a, b) => a?.parent?.name.toLowerCase().localeCompare(b?.parent?.name.toLowerCase()))
                        .map(category =>
                        <option key={category.id} value={category.id}>
                            {category?.parent?.name}>{category.name}
                        </option>
                    )
                }


            </Form.Select>
            {category!=='0' &&
                <div className="w-100 d-flex justify-content-center mt-3 mb-3">
                    <Link style={{textDecoration: "none"}} to={`/print/stocks/?category=${category}`} target="_blank">
                        <span className="myBtn">РАСПЕЧАТАТЬ ТЕКУЩИЕ ОСТАТКИ</span>
                    </Link>
                </div>
            }
        </Form>
    );
};

export default CategoriesList;