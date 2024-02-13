import {useMemo} from "react";

export const useOrdersSearch = (orders, searchQuery, unfinished) => {

    const searchedOrders = useMemo(() => {
        const unfinishedOrders = orders.filter(o => o.Выполнено===false)
        if(searchQuery.length>0 && unfinished){
            return (unfinishedOrders.filter(o => (o.Описание.toLowerCase().includes(searchQuery.toLowerCase()))
            ))
        } else if (searchQuery.length>0 && !unfinished){
            return (orders.filter(o => (o.Описание.toLowerCase().includes(searchQuery.toLowerCase()))
            ))
        } else if (unfinished) {
            return unfinishedOrders
        }
        else {
            return (orders)
        }
    }, [searchQuery, orders, unfinished])
    return searchedOrders
}