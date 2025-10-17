import {useMemo} from "react";

export const useOrderProductsFilter = (products, allProducts, supplier) => {
    const filteredOrderProducts = useMemo(() => {
        let filteredProducts = []
        if (!allProducts) {
            filteredProducts = [...products].filter(p =>
                p.need_to_order
            )
        } else {
            filteredProducts = products
        }

        if (supplier?.length > 0) {
            filteredProducts = filteredProducts.filter(p => p["productsRemote.supplier"] === supplier)
        }
        return filteredProducts

    }, [products, allProducts, supplier])
    return filteredOrderProducts
}