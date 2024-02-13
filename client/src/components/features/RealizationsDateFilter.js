import React, {useContext, useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import {Context} from "../../index";
import {addNewRealization, fetchRealizationsDateRange} from "../../http/realizationAPI";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";

const RealizationsDateFilter = observer(() => {
    const {realizations} = useContext(Context)
    const navigate = useNavigate()
    const date = new Date()
    let day = date.getDate()
    day = String(day).length>1 ? day : `0${day}`
    let month = date.getMonth()+1
    month = String(month).length>1 ? month : `0${month}`
    const year = date.getFullYear()
    const [dateFilter, setDateFilter] = useState({start: `${year}-${month}-${day}`, end: `${year}-${month}-${day}`});
    useEffect(() => {
        if (dateFilter.end && dateFilter.start){
            fetchRealizationsDateRange({dateStart: dateFilter.start, dateEnd: dateFilter.end})
                .then(data => {
                    realizations.setRealizations(data)
                })
        }
    }, [dateFilter]);

    const addReal = async (e) => {
        e.preventDefault()
        await addNewRealization().then(data => {
            navigate(`/manager/realizations/item/${data.id}`)
        })
    }

    return (
        <div>
            <Form className="d-flex justify-content-center gap-3">
                <Form.Label className="d-flex justify-content-center gap-3 w-25 align-items-center">
                    <div>С</div>
                    <Form.Control type={"date"} value={dateFilter.start} onChange={e => setDateFilter({...dateFilter, start: e.target.value})} />
                </Form.Label>
                <Form.Label className="d-flex justify-content-center gap-3 w-25 align-items-center">
                    <div>По</div>
                    <Form.Control type={"date"} value={dateFilter.end} onChange={e => setDateFilter({...dateFilter, end: e.target.value})} />
                </Form.Label>
                <button style={{padding: "2px 20px", height: "38px"}} onClick={(e) => addReal(e)}>НОВАЯ РЕАЛИЗАЦИЯ</button>
            </Form>
        </div>
    );
});

export default RealizationsDateFilter;