import React, {useState} from "react";
import BarcodelessProducts from "../components/features/BarcodelessProducts";
import Barcode from "react-barcode";
import {Accordion, Form} from "react-bootstrap";

const BarcodelessProductsPage = () => {
    const [barcode, setBarcode] = useState(0)
    function createEAN8(ean7Digits) {

        let sum = 0;
        for (let i = 0; i < ean7Digits.length; i++) {
            const digit = parseInt(ean7Digits[i]);
            sum += (i % 2 === 0) ? digit * 3 : digit * 1;
        }
        const remainder = sum % 10;
        return (remainder === 0) ? `${ean7Digits}0` : `${ean7Digits}${10 - remainder}`;
    }
    return (
        <div>
            <h3 className='text-center'>Штрихкоды товаров:</h3>
            <Accordion className="BarcodeLessGeneratorAccordion mb-3">
                <Accordion.Item eventKey={'1'}>
                    <Accordion.Header><div className="text-center w-100 headerText">Генератор штрихкодов</div></Accordion.Header>
                    <Accordion.Body>
                        <div className="d-flex justify-content-center align-items-center flex-column" >
                            <Form>
                                <Form.Control className="text-center" placeholder="Код продукта...." value={barcode ? barcode : ''} onChange={e => setBarcode(e.target.value)} onFocus={() => setBarcode(0)} />
                            </Form>
                            <Barcode className="mt-3" value={createEAN8(String(barcode).padStart(7, "5"))} format={"EAN8"} />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>


            <BarcodelessProducts createEAN8={createEAN8} />
        </div>
    );
};

export default BarcodelessProductsPage;