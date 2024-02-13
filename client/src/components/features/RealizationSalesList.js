import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import Loader from "../../UI/Loader/Loader";
import RealizationListItem from "./RealizationListItem";

const RealizationSalesList = observer(({setRefresh}) => {
    const {realizations, loading} = useContext(Context)

    if(loading.loading) {return <Loader />}
    return (
        <div>
            <div className="realizationListHeader">
                <div></div>
                <div>Код</div>
                <div>Наименование</div>
                <div>Цена</div>
                <div>Кол-во</div>
                <div>Сумма</div>
                <div>Остаток</div>
            </div>
            {realizations.realizationItems.length > 0 &&

                realizations.realizationItems.map(r =>
                    <RealizationListItem setRefresh={setRefresh} key={r.Счетчик} item={r} />
                )
            }
        </div>
    );
});

export default RealizationSalesList;