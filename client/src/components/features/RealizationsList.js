import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import RealizationsListItem from "./RealizationsListItem";
import {Accordion} from "react-bootstrap";

const RealizationsList = observer(() => {
    const {realizations} = useContext(Context)
    return (
        <div className="d-flex flex-column align-items-center">

            <div className="realizationsListHeader">
                <div>Дата</div>
                <div>№ реализации</div>
                <div>Сумма</div>
                <div></div>
                <div></div>
            </div>
             <Accordion defaultActiveKey="0" className="realizationsListAccordion">
                {realizations.realizations?.length>0 &&
                    realizations.realizations.map(r =>

                       <RealizationsListItem  key={r.Счетчик} realization={r} />
                    )
                }
             </Accordion>
        </div>
    );
});

export default RealizationsList;