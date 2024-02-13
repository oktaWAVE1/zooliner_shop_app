import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {fetchNoBarcodeProducts} from "../../http/barcodeAPI";
import Loader from "../../UI/Loader/Loader";
import BarcodeListItem from "./BarcodeListItem";
import {Alert} from "react-bootstrap";

const BarcodeList = observer(() => {
    const [refresh, setRefresh] = useState(1);
    const {loading} = useContext(Context)
    const [noBarProducts, setNoBarProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    useEffect(() => {
        loading.setLoading(true)
        fetchNoBarcodeProducts().then(data => {
            setNoBarProducts(data)
        })
            .finally(() => loading.setLoading(false))
    }, [refresh]);

    if (loading.loading) return <Loader />
    return (
        <div>
            {alertMessage.show &&
                <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                    <Alert.Heading>{alertMessage.title}</Alert.Heading>
                    <p className={'mb-1'}>
                        {alertMessage.message}
                    </p>
                </Alert>
            }
            {noBarProducts.length>0 &&
                noBarProducts.map(p =>
                    <BarcodeListItem setAlertMessage={setAlertMessage} setRefresh={setRefresh} key={p.Код} product={p} />                )
            }
        </div>
    );
});

export default BarcodeList;