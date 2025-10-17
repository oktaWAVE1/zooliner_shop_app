import React, {useContext, useRef, useState} from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import cl from './MyNavbar.module.css'
import {Link, useLocation, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {userLogout} from "../../http/userAPI";




const MyNavbar = observer(() => {
    const {user, siteOrders} = useContext(Context)
    const location = useLocation()
    const isPrintable = location.pathname.split('/')[1]==='print'
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false);
    const logout = () => {
        if(window.confirm('Уверены, что желаете выйти?')) {
            userLogout().then(() => {
                user.setUser({})
                user.setIsAuth(false)
                localStorage.removeItem('token')
                navigate('/')
            })
        }
    }

    const menuRef = useRef(null)
    const togglerRef = useRef(null)

    if (isPrintable) return <></>
    return (
        <header>
            <Navbar className={cl.navbar} expanded={expanded} expand="lg" variant="dark">
                <Container className={cl.container}>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav"  ref={togglerRef} onClick={() => setExpanded(expanded ? false : "expanded")} />
                    <Navbar.Collapse id="responsive-navbar-nav" ref={menuRef}>
                        <div className="d-flex justify-content-between w-100">
                            {(user.user?.role==='MANAGER' || user.user?.role==="ADMIN") &&
                                <Nav>
                                    <Link className={cl.navbarItem} to={'/manager/realizations'}>Список реализаций</Link>
                                    <Link className={cl.navbarItem} to={'/barcodeless'}>ШК</Link>
                                    <Link className={cl.navbarItem} to={'/orders'}>Заказы</Link>
                                    <Link className={cl.navbarItem} to={'/customers'}>Клиенты</Link>
                                    <Link className={cl.navbarItem} to={'/barcodes'}>Штрихкоды</Link>
                                    <Link className={cl.navbarItem} to={'/price-tags'}>Ценники</Link>
                                    <Link className={cl.navbarItem} to={'/stocks'}>Проверка остатков</Link>
                                    <Link className={siteOrders?.siteOrders?.length>0 ? [cl.navbarItem, 'internetOrdersLink'].join(' ') : cl.navbarItem} to={'/site/orders'}>Интернет заказы<span>{siteOrders?.siteOrders?.length>0 && siteOrders?.siteOrders?.length}</span></Link>
                                </Nav>
                            }

                            {user.user?.role==="ADMIN" &&
                                <Nav>
                                    <Link className={siteOrders?.siteOrders?.length>0 ? [cl.navbarItem, 'internetOrdersLink'].join(' ') : cl.navbarItem} to={'/admin/orderList'}>OrderList<span>{siteOrders?.siteOrders?.length>0 && siteOrders?.siteOrders?.length}</span></Link>
                                    <Link className={siteOrders?.siteOrders?.length>0 ? [cl.navbarItem, 'internetOrdersLink'].join(' ') : cl.navbarItem} to={'/admin/invoice'}>Invoice<span>{siteOrders?.siteOrders?.length>0 && siteOrders?.siteOrders?.length}</span></Link>
                                </Nav>
                            }
                            {user.isAuth && <Nav className="d-flex justify-content-center align-items-start logoButtons">

                                <div onClick={() => logout()} className={[cl.logout_btn, cl.navbarItem].join(" ")}>
                                   "Выход"
                                </div>

                            </Nav>
                            }

                        </div>

                    </Navbar.Collapse>

                </Container>
            </Navbar>

        </header>
    );
});

export default MyNavbar;