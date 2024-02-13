import React, {useContext, useEffect, useState} from 'react';
import {Pagination} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const ItemsPagination =  observer(({total, limit}) => {
    const {currentPages} = useContext(Context)
    const [pages, setPages] = useState([1]);
    const clickPage = (page) =>{
        currentPages.setPage(page)
    }
    useEffect(() => {
        const lastPage = Math.ceil(total/limit)
        let pageArray = []
        if (total/limit<7){
            pageArray = []
            for (let i=1; i<=lastPage; i++){
                pageArray.push(i)
            }
        } else if (currentPages.page<4 || currentPages.page>lastPage-3){
            pageArray =[1, 2, 3, 4, '...', lastPage-3, lastPage-2, lastPage-1, lastPage]
        } else {
            pageArray = [1, '...', currentPages.page-2, currentPages.page-1, currentPages.page, currentPages.page+1, currentPages.page+2, '...', lastPage]
        }
        setPages([...pageArray])
        pageArray = []
    }, [total, currentPages.page, limit]);

    return (
        <div>
            <Pagination>
                {pages.map((p, index) =>
                    <Pagination.Item
                        className={typeof(p)!=='number' && "paginationDelimiter"}
                        active={p === currentPages.page}
                        key={index}
                        onClick={() => typeof(p)==='number' &&  clickPage(p)}
                    >
                        {p}
                    </Pagination.Item>
                )}
            </Pagination>
        </div>
    );
});

export default ItemsPagination;