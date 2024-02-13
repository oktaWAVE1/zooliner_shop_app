import React, {useContext, useEffect, useState} from 'react';
import {fetchPriceTags} from "../../http/pricetagAPI";
import {Context} from "../../index";

const PriceTagsToPrint = () => {
    const {loading} = useContext(Context)
    const date = new Date()
    const [productTags, setProductTags] = useState([]);
    useEffect(() => {
        loading.setLoading(true)
        fetchPriceTags().then(data => {
            setProductTags(data)
        }).finally(() => {
            loading.setLoading(false)
            setTimeout(() => {
                const css = '@page { size: landscape; }',
                    head = document.head || document.getElementsByTagName('head')[0],
                    style = document.createElement('style');

                style.type = 'text/css';
                style.media = 'print';

                if (style.styleSheet){
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                head.appendChild(style);
                window.print()
            }, 1000)

        })
    }, [loading.refresh]);
    return (
        <div className="priceTagToPrintList">
            {productTags.length>0 &&
                productTags.sort((a,b) => a.title.length-b.title.length).map((pt, index) =>
                    <div className="priceTagItem" key={`${pt.id}||${index}`}>
                        <div className="priceTagTitle">{pt.title}</div>
                        <h2 className="text-center w-100 mt-2 mb-0">{pt.price} ₽</h2>
                        <div className='d-flex justify-content-between w-100 align-items-end'>
                            <div>
                                <div style={{height: "15px"}}>
                                    <small>ZL{pt.id}</small>
                                </div>
                                <div>
                                    <small>ИП Косыгин С.В.</small>
                                </div>
                            </div>
                            <div className="mx-2"><small>{date.toLocaleDateString()}</small></div>
                        </div>
                    </div>

                )
            }
        </div>
    );
};

export default PriceTagsToPrint;