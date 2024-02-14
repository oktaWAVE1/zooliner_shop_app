import React, {useState} from 'react';
import {Form, Modal} from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";

const CashboxModal = ({show, onHide, cardTotal, cashTotal, deliveryCardTotal, deliveryCashTotal}) => {
    const [moneyFact, setMoneyFact] = useState({cashFinish: 0, cardFinish: 0, deliveryCash: 0, deliveryCard: 0, online: 0, suppliers: 0});
    const [morningCash, setMorningCash] = useState(0);
    const cashDifference = Math.round(Number(moneyFact.cashFinish) -Number(cashTotal) - Number(morningCash) + Number(moneyFact.deliveryCash) + Number(moneyFact.suppliers) + Number(moneyFact.online))
    const cardDifference = Math.round(Number(moneyFact.cardFinish) + Number(moneyFact.deliveryCard) - Number(cardTotal))
    useDebounce(() => {
        setMoneyFact({...moneyFact, deliveryCash: deliveryCashTotal, deliveryCard: deliveryCardTotal})
    }, 50, [deliveryCashTotal, deliveryCashTotal, show])
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
                    <h3>Подсчет сумм в кассе: </h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-end w-100 mb-2">
                    <button onClick={() => {
                        setMoneyFact({cashFinish: 0, cardFinish: 0, deliveryCash: 0, deliveryCard: 0, online: 0, suppliers: 0})
                        setMorningCash(0)
                    }}>ОЧИСТИТЬ</button>
                </div>
                <Form>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Утром в кассе: </div>
                        <Form.Control type={"number"} value={morningCash} onChange={e => setMorningCash(e.target.value)} />
                    </Form.Label>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Наличных в кассе на конец дня: </div>
                        <Form.Control type={"number"} value={moneyFact.cashFinish} onChange={e => setMoneyFact({...moneyFact, cashFinish: e.target.value})} />
                    </Form.Label>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Безнал за день по терминалу: </div>
                        <Form.Control type={"number"} value={moneyFact.cardFinish} onChange={e => setMoneyFact({...moneyFact, cardFinish: e.target.value})} />
                    </Form.Label>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Переводы без доставок: </div>
                        <Form.Control type={"number"} value={moneyFact.online} onChange={e => setMoneyFact({...moneyFact, online: e.target.value})} />
                    </Form.Label>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Оплата поставщикам \ за доставку: </div>
                        <Form.Control type={"number"} value={moneyFact.suppliers} onChange={e => setMoneyFact({...moneyFact, suppliers: e.target.value})} />
                    </Form.Label>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Доставки нал \ перевод: </div>
                        <Form.Control disabled={true} type={"number"} value={moneyFact.deliveryCash} onChange={e => setMoneyFact({...moneyFact, deliveryCash: e.target.value})} />
                    </Form.Label>
                    <Form.Label className='d-flex align-items-center'>
                        <div className="w-25">Доставки безнал: </div>
                        <Form.Control disabled={true} type={"number"} value={moneyFact.deliveryCard} onChange={e => setMoneyFact({...moneyFact, deliveryCard: e.target.value})} />
                    </Form.Label>
                </Form>
                <div className='d-flex w-100 flex-column align-items-center'>
                    <h3>{cashDifference === 0
                        ? "Нал сошелся"
                        : cashDifference > 0
                            ? `Лишний нал ${cashDifference}`
                            : `Недостача по налу ${cashDifference}`
                    }</h3>
                    <h3>{cardDifference === 0
                        ? "Безнал сошелся"
                        : cardDifference > 0
                        ? `Лишний безнал ${cardDifference}`
                        : `Недостача по безналу ${cardDifference}`
                    }</h3>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <button onClick={onHide}>Закрыть</button>
            </Modal.Footer>
        </Modal>
    );
};

export default CashboxModal;