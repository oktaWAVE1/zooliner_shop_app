import {useMemo} from "react";

export const useCustomersSearch = (customers, searchQuery) => {
    const sortedCustomers = [...customers].sort((a,b) => a.Телефон - b.Телефон)
    const searchedCustomers = useMemo(() => {
        if(searchQuery.length>0){
            return (sortedCustomers.filter(c => (
                (c?.Имя && c.Имя.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c?.Телефон && c.Телефон.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c?.Адрес && c.Адрес.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c?.Комментарий && c.Комментарий.toLowerCase().includes(searchQuery.toLowerCase()))
            )))
        }
        else {
            return (sortedCustomers)
        }
    }, [customers, searchQuery])
    return searchedCustomers
}