import React from 'react';
import {Form} from "react-bootstrap";

const RealizationDate = ({date, setDate, disabled}) => {
    return (
        <Form>
            <Form.Label className='d-flex gap-3 align-items-center'>
                <span style={{width: "120x"}}>Назначить дату</span>
                <Form.Control className="py-1" style={{width: "150px"}} type="date" placeholder="Назначить дату реализации..." value={date} onChange={e => setDate(e.target.value)} disabled={disabled} />
            </Form.Label>
        </Form>
    );
};

export default RealizationDate;