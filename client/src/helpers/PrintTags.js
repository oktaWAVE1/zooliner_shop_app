import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PriceTagsToPrint from "../components/features/PriceTagsToPrint";


const Example = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <PriceTagsToPrint ref={componentRef} />
            <button onClick={handlePrint}>Print this out!</button>
        </div>
    );
};