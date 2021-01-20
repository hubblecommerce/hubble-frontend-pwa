function cartProductMapping (payload){
    let product = payload.product;
    let obj = {};

    obj.name_orig = product.label;
    obj.id = product.id;
    obj.referenceId = product.referencedId;
    obj.qty = product.quantity;
    obj.final_price_item = {
        special_price: null,
        display_price_brutto: product.price.unitPrice,
    },
    obj.image = product.cover.url;
    obj.url_pds = null;
    obj.variants = product.payload.options.map((option) => {
        return {
            label: option.group,
            value_label: option.option,
        };
    });
    return obj;
}

export {cartProductMapping};