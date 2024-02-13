import React, {useContext, useEffect, useState} from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {adminRoutes, authRoutes, managerRoutes, publicRoutes} from "../routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Loader from "../UI/Loader/Loader";


const AppRouter = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => setLoading(false),480)
    }, []);

    if(loading) return <Loader />

    return (
            <Routes>
                {user.isAuth ?
                    authRoutes.map(r =>
                        <Route key={r.path} path={r.path} element={r.element}/>
                    ) :
                    publicRoutes.map(r =>
                        <Route key={r.path} path={r.path} element={r.element}/>
                    )
                }
                {user.user?.role==='ADMIN' &&
                    adminRoutes.map(r =>
                        <Route key={r.path} path={r.path} element={r.element}/>
                    )
                }

                {user.user?.role==='MANAGER' &&
                    managerRoutes.map(r =>
                        <Route key={r.path} path={r.path} element={r.element}/>
                    )
                }
                {user.isAuth ?
                <Route path="/*" element={<Navigate to='/manager/realizations' />} /> :
                <Route path="/*" element={<Navigate to='/' />} />
                }

            </Routes>

    );
});

export default AppRouter;