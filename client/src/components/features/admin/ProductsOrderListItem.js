import React from 'react';

const ProductsOrderListItem = ({product}) => {
    const handleCopyText = async (id) => {
        try {
            const text = document.getElementById(id).innerText;
            await navigator.clipboard.writeText(`${text}${text?.length>15 ? ' - ' : ''}`);

        } catch (error) {
            console.error('Не удалось скопировать текст:', error);
        }
    };

    return (
        <div className="ProductListItem">
            <div>{product?.['Код товара']}</div>
            <div className='pointer' onClick={() => handleCopyText(`SKU-${product?.['productsRemote.SKU']}`)} id={`SKU-${product?.['productsRemote.SKU']}`}>{product?.['productsRemote.SKU']}</div>
            <div className='pointer' onClick={() => handleCopyText(`код-${product?.['Код товара']}`)} id={`код-${product?.['Код товара']}`}>{product?.['productsRemote.full_name']}</div>
            <div className="text-center" title="Остаток"><strong>{product?.['productsRemote.product_in_stock']}</strong></div>
            <div className="text-center" title="">{product?.['productsRemote.ABC']}</div>
            <div className="text-center" title="В месяц"><strong>{product?.['monthly_sum']}</strong></div>
            <div className="text-center" title="В год">{product?.['yearly_sum']}</div>
            <div className="text-center" title="Всего">{product?.['total_sum']}</div>
            <div className="text-end" title="Цена">{product?.['productsRemote.Цена']}</div>
        </div>
    );
};

export default ProductsOrderListItem;