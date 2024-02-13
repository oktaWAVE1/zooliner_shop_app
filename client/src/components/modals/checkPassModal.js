import React, {useContext, useState} from 'react';
import {Alert, Form, Modal} from "react-bootstrap";
import {checkPassword} from "../../http/userAPI";
import Loader from "../../UI/Loader/Loader";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const CheckPassModal = observer(({onHide, show, email}) => {
    const {user} = useContext(Context)
    const [pass, setPass] = useState('');
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const doAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await checkPassword({email, pass})
                .then(data =>
                {
                    user.setUser(data)
                    if(data?.role) {
                        user.setIsAuth(true)
                    }
                 }
            ).finally(() => {
                setLoading(false)
                })

        } catch (e) {
            setAlertMessage({message: e.response.data.message, show: true, variant: 'danger'})
            if (e.response.data.message === "Лимит использования пароля исчерпан. Запросите новый."){
                setIsDisabled(true)
                setTimeout(() => {onHide()}, 4000)
            }
            setLoading(false)
        }
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
                    <h3>Код доступа отправлен на {email}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <Loader />}
                {!loading && <>

                    {alertMessage.show &&
                        <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p className={'mb-1'}>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }
                   <Form className="d-flex flex-column">
                       <Form.Control type="text" placeholder="Введите пароль..." value={pass} onChange={e => setPass(e.target.value)} />
                       <div className="d-flex justify-content-center mt-3">
                            <button disabled={!pass || isDisabled} onClick={e => doAuth(e)}>ВОЙТИ</button>
                       </div>
                   </Form>
                    </>
                }

            </Modal.Body>
            <Modal.Footer>
                <button onClick={onHide}>Закрыть</button>
            </Modal.Footer>
        </Modal>
    );
});

export default CheckPassModal;