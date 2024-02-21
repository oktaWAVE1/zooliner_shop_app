import React, {useEffect, useState} from 'react';
import {fetchDeliveryMethods} from "../../http/realizationAPI";
import {Form} from "react-bootstrap";

const DeliveryMethodsFeature = ({currentDeliveryMethod, setDeliveryMethod}) => {
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    useEffect(() => {
        fetchDeliveryMethods().then(data => setDeliveryMethods(data))
    }, []);
    return (
        <Form id={`DeliveryMethodsForm`}>
            <Form.Select style={{width: "220px"}} className="mt-1 py-1"
                         onChange={(e) => setDeliveryMethod(e)} value={currentDeliveryMethod}>
                <option value={'0'}>Без доставки</option>
                {deliveryMethods?.length > 0 &&
                    deliveryMethods.map(d =>
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    )
                }

            </Form.Select>

        </Form>
    );
};

export default DeliveryMethodsFeature;