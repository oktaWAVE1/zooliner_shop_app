import React, {useState} from 'react';
import {Form, Card, Container, Alert} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {login} from "../http/userAPI";

import Loader from "../UI/Loader/Loader";
import CheckPassModal from "../components/modals/checkPassModal";

const AuthPage = observer(() => {
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        email: ''
    })
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})


    const doAuth = async (event) => {
        event.preventDefault();
        try {
            setLoading(true)
            setIsDisabled(false)
            await login({email:currentUser.email})
                .then(() => {

                    setShowModal(true)
                }
                ).finally(() =>
                    setLoading(false)
                )

        } catch (e) {
            setAlertMessage({message: e.response.data.message, show: true, variant: 'danger'})
        }
    }
    if (loading){
        return <Loader />
    }

    return (
        <Container className="loginPage d-flex h-100 flex-column justify-content-center">
            <CheckPassModal onHide={() => setShowModal(false)} show={showModal} email={currentUser.email} />
            <Card className="p-3">
                <Form id="SubmitLoginForm" onSubmit={doAuth} className='auth_form p-3'>
                    <h1>Авторизация</h1>
                    {alertMessage.show &&
                        <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p className={'mb-1'}>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }


                    <Form.Control
                        className="p-2 my-3"
                        value={currentUser.email}
                        onChange={e => setCurrentUser( {...currentUser, email: e.target.value})}
                        placeholder={'Email'}
                        type='text'
                    />

                    <div className="d-flex justify-content-center w-100 pt-3">
                        <button
                            className="auth_btn"
                            disabled={!currentUser.email || isDisabled}
                            type='submit'
                        >
                           ВОЙТИ
                        </button>
                    </div>


                </Form>

            </Card>

        </Container>
    );
});

export default AuthPage;