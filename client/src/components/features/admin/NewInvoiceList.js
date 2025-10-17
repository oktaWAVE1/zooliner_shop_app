import React, {Suspense, useEffect, useState} from 'react';
import {fetchInvoice, fetchInvoiceList, processInvoice} from "../../../http/invoiceAPI";
import Loader from "../../../UI/Loader/Loader";
import {Form} from "react-bootstrap";
import FinishedInvoiceItem from "./FinishedInvoiceItem";
import {fetchSuppliers} from "../../../http/orderAPI";
import NewInvoiceItem from "./NewInvoiceItem";
import NewInvoiceItemForm from "./NewInvoiceItemForm";
import useDebounce from "../../../hooks/useDebounce";

const NewInvoiceList = () => {
    const [invoiceList, setInvoiceList] = useState([])
    const [writeChanges, setWriteChanges] = useState(0)
    const [writeDeliveryCost, setWriteDeliveryCost] = useState({interest: 0})
    const [currentInvoiceName, setCurrentInvoiceName] = useState('')
    const [currentInvoiceList, setCurrentInvoiceList] = useState([])
    const [currentInvoiceSum, setCurrentInvoiceSum] = useState(0.0)
    const [suppliers, setSuppliers] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [currentSupplier, setCurrentSupplier] = useState('')
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(100)
    const [finishedInvoiceName, setFinishedInvoiceName] = useState('')
    const [finishedInvoice, setFinishedInvoice] = useState([])
    const [finishedInvoiceSum, setFinishedInvoiceSum] = useState(0.0)
    const [disableWriteButton, setDisableWriteButton] = useState(false)
    const [deliveryCost, setDeliveryCost] = useState(0)

    useEffect(() => {
        setLoading(true)
        if (finishedInvoiceName) {
            fetchInvoice({invoiceName: finishedInvoiceName}).then(data => {
                setFinishedInvoice(data)
                if (data?.length > 0) {
                    let invoiceSum = data.reduce((acc, val) => val.Сумма + acc, 0)
                    setFinishedInvoiceSum(invoiceSum.toFixed(2))
                } else setFinishedInvoiceSum(0)
            })
        } else {
            setFinishedInvoice([])
            setFinishedInvoiceSum(0)
        }
        fetchInvoiceList({limit}).then(data => {

            setInvoiceList(data)
        }).finally(() => setLoading(false))
    }, [finishedInvoiceName]);

    useDebounce(async () => {
        await handleUpdateCurrentInvoice()
    }, 0, [refresh])

    useEffect(() => {
        fetchSuppliers().then(data => setSuppliers(data))
    }, []);

    const handleAddDeliveryCost = (e) => {
        e.preventDefault()
        const interest = deliveryCost / currentInvoiceSum
        setWriteDeliveryCost({...writeDeliveryCost, interest})
        setDeliveryCost(0)
    }


    const handleUpdateCurrentInvoice = async () => {
        setLoading(true)

        await fetchInvoice({invoiceName: currentInvoiceName}).then(data => {
            setCurrentInvoiceList(data)
            if (data?.length > 0) {
                let invoiceSum = data.reduce((acc, val) => val.Сумма + acc, 0)
                setCurrentInvoiceSum(invoiceSum.toFixed(2))
            } else setCurrentInvoiceSum(0)

        }).finally(() => setLoading(false))
    }
    const handleWriteChanges = (e) => {
        e.preventDefault()
        setDisableWriteButton(true)
        setWriteChanges(prev => prev + 1)

        setTimeout(() => {
            setRefresh(prev => prev + 1)
            setDisableWriteButton(false)
        }, 3000)
    }

    const handleProcessInvoice = async (e) => {
        e.preventDefault()
        await processInvoice({invoiceName: currentInvoiceName, supplier: currentSupplier}).then(data => {
            setFinishedInvoiceName(currentInvoiceName)
            setRefresh(prev => prev + 1)
        })

    }


    return (
        <div>
            {invoiceList?.length > 0 &&
                <Suspense>

                    <Form id={"selectInvoiceForm"} onSubmit={e => e.preventDefault()}>
                        <div className="d-flex gap-3 justify-content-between align-items-start">

                            <Form.Select className="mt-1 mb-4 py-1 w-25"
                                         onChange={(e) => setFinishedInvoiceName(e.target.value)}
                                         value={finishedInvoiceName || "Выберите приход"}>
                                <option value={''}>Приходы</option>
                                {
                                    invoiceList.map((i) =>
                                        <option key={i['Номер счета']} value={i['Номер счета'].replace("\\\\", "\\")}>
                                            {i['Номер счета'].replace("\\\\", "\\")}
                                        </option>
                                    )
                                }
                            </Form.Select>
                            <div className="d-flex flex-column">
                                <button type="button" className="px-2 py-1" disabled={currentInvoiceList?.length < 1}
                                        onClick={(e) => handleWriteChanges(e)}>записать изменения
                                </button>
                                <button type="button" className="px-2 py-1 mb-2" disabled={currentInvoiceList?.length < 1 || !currentInvoiceName || !currentSupplier || (currentInvoiceList?.length>0 && !currentInvoiceList.some(item => item?.Проведено!==true))}
                                        onClick={(e) => handleProcessInvoice(e)}>На приход
                                </button>

                            </div>

                            <div className="d-flex w-50 gap-2">


                                <Form.Select  className="w-50" disabled={currentInvoiceList?.length > 0}
                                             onChange={(e) => setCurrentSupplier(e.target.value)}
                                             value={currentSupplier || "Выберите поставщика"}>
                                    <option value={''}>Все поставщики</option>
                                    {
                                        suppliers.map((s, index) =>
                                            <option key={index} value={s}>
                                                {s}
                                            </option>
                                        )
                                    }
                                </Form.Select>


                                <Form.Control className="w-50" placeholder="№ счета..." value={currentInvoiceName}
                                              onBlur={(e) => handleUpdateCurrentInvoice(e)}
                                              onChange={e => setCurrentInvoiceName(e.target.value)}/>
                            </div>

                        </div>


                    </Form>
                </Suspense>
            }

            <div>
                <NewInvoiceItemForm handleAddDeliveryCost={handleAddDeliveryCost} deliveryCost={deliveryCost}
                                    setDeliveryCost={setDeliveryCost} setRefresh={setRefresh}
                                    invoiceName={currentInvoiceName} supplier={currentSupplier}/>
            </div>


            {disableWriteButton &&
                <Loader/>
            }
            <Suspense>
                {currentInvoiceList?.length > 0
                    && currentInvoiceList.map((cil, index) =>
                        <NewInvoiceItem writeDeliveryCost={writeDeliveryCost} writeChanges={writeChanges} item={cil}
                                        index={index + 1} setRefresh={setRefresh} key={cil.Счетчик}/>
                    )
                }
            </Suspense>
            {currentInvoiceSum > 0 &&
                <div className="text-end mt-4 mb-4"><strong>Итого: {currentInvoiceSum}</strong></div>
            }

            {loading &&
                <div style={{position: "absolute", left: "50%", transform: "translate(-50%, -50%)", top: "50%"}}>
                    <Loader/>
                </div>
            }
            <Suspense>
                {finishedInvoice?.length > 0 &&
                    <div>
                        <hr/>
                        <h2>Просмотр прихода</h2>
                        {finishedInvoice.map(cfi =>
                            <FinishedInvoiceItem key={cfi.Счетчик} setRefresh={setRefresh} item={cfi}/>
                        )}
                    </div>

                }
            </Suspense>
            {finishedInvoiceSum > 0 &&
                <div className="text-end mt-4 mb-4"><strong>Итого: {finishedInvoiceSum}</strong></div>
            }

        </div>
    );
};

export default NewInvoiceList;