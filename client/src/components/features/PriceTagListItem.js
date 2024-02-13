import React, {useContext} from 'react';
import {delPriceTag} from "../../http/pricetagAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const PriceTagListItem = observer(({tag}) => {
    const {loading} = useContext(Context)
    const deleteTag = async() => {
        await delPriceTag({Код: tag.id}).then(() => loading.setRefresh(prev => prev+1))
    }
    return (
        <div className="d-flex gap-3">
            <div key={tag.id}>{tag.title}</div>
            <div><span className="del_btn" onClick={() => deleteTag()}>удалить</span></div>
        </div>
    );
});

export default PriceTagListItem;