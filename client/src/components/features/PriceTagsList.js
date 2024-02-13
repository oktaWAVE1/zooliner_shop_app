import React, {useContext, useEffect, useRef, useState} from 'react';
import {fetchPriceTags} from "../../http/pricetagAPI";
import PriceTagListItem from "./PriceTagListItem";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import Loader from "../../UI/Loader/Loader";
import {PriceTagsToPrint} from "./PriceTagsToPrint";

const PriceTagsList = observer(() => {
    const {loading} = useContext(Context)
    const [productTags, setProductTags] = useState([]);
    useEffect(() => {
        loading.setLoading(true)
        fetchPriceTags().then(data => {
            setProductTags(data)
        }).finally(() => loading.setLoading(false))
    }, [loading.refresh]);
    if(loading.loading) return <Loader />
    return (
        <div>

            {productTags?.length>0 ?
                <>
                    <h4 className="text-center mt-2">Актуальный список ценников:</h4>
                {productTags.sort((a,b) => a?.title.toLowerCase().localeCompare(b?.title.toLowerCase())).map((pt, index) =>
                        <PriceTagListItem key={`${pt.id}||${index}`} tag={pt} />
                    )}
                </> :
                <h4 className="text-center mt-2">АКТУАЛЬНЫХ ЦЕННИКОВ НЕТ</h4>
            }

        </div>
    );
});

export default PriceTagsList;