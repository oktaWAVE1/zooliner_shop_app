import React, {useEffect, useState} from 'react';
import {fetchPopularProducts} from "../../http/productAPI";
import {Accordion} from "react-bootstrap";
import Barcode from "react-barcode";

const BarcodelessProducts = ({createEAN8}) => {
    const [products, setProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState({key: '', items: []});


    useEffect(() => {
        fetchPopularProducts().then(data => {
            setProducts(data)


        })

    }, []);
    return (
        <div>
            <div className="d-flex w-100 gap-3">
                <div className="d-flex flex-column gap-1 w-25">
                    {products.length > 0 &&
                        products.map(group =>
                            <button onClick={() => setCurrentProducts({key: group.key, items: group.items})}
                                    className="px-2 py-1" key={group.key}>{group.key}</button>
                        )
                    }
                </div>
                <div className="d-flex flex-column gap-1 w-75">
                    {currentProducts?.items?.length > 0 &&
                        currentProducts.items.sort((a, b) => a?.parent?.Наименование.toLowerCase().localeCompare(b?.parent?.Наименование.toLowerCase())).map((p, index) =>
                            <div className="px-2 py-0 d-flex gap-1 flex-column" key={p.Код}>

                                    <Accordion className="BarcodeLessProductAccordion mb-3">
                                        <Accordion.Item eventKey={index}>
                                            <Accordion.Header><div className="text-center w-100 headerText">{p?.parent?.Код ? `${p.parent?.Наименование} ${p.parent['Наименование (крат опис)']} ${p.Наименование}` : `${p.Наименование} ${p['Наименование (крат опис)']}`}</div></Accordion.Header>
                                            <Accordion.Body>
                                                <div className="d-flex justify-content-center">
                                                    {p?.children?.length>0 ?
                                                        p?.children.map(pc =>
                                                                <Accordion className="BarcodeLessChildProductAccordion mb-3">
                                                                    <Accordion.Item eventKey={index}>
                                                                        <Accordion.Header><div className="text-center w-100 headerText">{pc.Наименование}</div></Accordion.Header>
                                                                        <Accordion.Body>
                                                                            <Barcode value={createEAN8(String(pc.Код).padStart(7, "5"))} format={"EAN8"} />
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                            )

                                                        :

                                                    <Barcode value={createEAN8(String(p.Код).padStart(7, "5"))} format={"EAN8"}  />
                                                    }
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                            </div>
                                )

                    }

                </div>

            </div>

        </div>
    );
};

export default BarcodelessProducts;