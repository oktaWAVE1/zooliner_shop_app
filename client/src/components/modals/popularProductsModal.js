import React, {useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import {fetchPopularProducts} from "../../http/productAPI";
import {addNewRealizationItem} from "../../http/realizationAPI";

const PopularProductsModal = ({show, onHide, id, setRefresh, disabled}) => {
    const [products, setProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState({key: '', items: []});
    useEffect(() => {
        fetchPopularProducts().then(data => {
            console.log(data)
            setProducts(data)})
    }, []);

    const addItem = async (productId) => {
        await addNewRealizationItem({
            realizationId: id,
            itemId: productId
        }).then(() => {
            setRefresh(prev => prev+1)
            onHide()
        })
    }
    return (
        <Modal
            className='modal'
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h3>Популярные товары:</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex w-100 gap-3">
                    <div className="d-flex flex-column gap-1 w-25">
                        {products.length>0 &&
                            products.map(group =>
                            <button onClick={() => setCurrentProducts({key: group.key, items: group.items})} className="px-2 py-1" key={group.key}>{group.key}</button>
                            )
                        }
                    </div>
                    <div className="d-flex flex-column gap-1 w-75">
                        {currentProducts?.items?.length>0 &&
                            currentProducts.items.sort((a,b) =>  a?.parent?.Наименование.toLowerCase().localeCompare(b?.parent?.Наименование.toLowerCase())).map(p =>
                                <div className="px-2 py-0 d-flex gap-1 flex-column" key={p.Код}>
                                    {p?.parent?.Код ? <button disabled={disabled} onClick={() => addItem(p.Код)} className="w-100 py-0 px-2">{`${p.parent?.Наименование} ${p.parent['Наименование (крат опис)']} ${p.Наименование}`}</button> :
                                        p?.children?.length>0 && p.children.map(pc =>
                                        <button disabled={disabled} onClick={() => addItem(pc.Код)} className="w-100 py-0 px-2" key={pc.Код}>{`${p?.Наименование} ${p['Наименование (крат опис)']} ${pc.Наименование}`}</button>
                                    )
                                    }
                                </div>
                            )
                        }
                    </div>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <button onClick={onHide}>Закрыть</button>
            </Modal.Footer>
        </Modal>
    );
};

export default PopularProductsModal;