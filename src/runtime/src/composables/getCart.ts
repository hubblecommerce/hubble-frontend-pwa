export const getCart = () => {
    return {
        total: 4,
        lineItems: [
            {
                id: 123,
                name: 'Product Name 1',
                qty: 1
            },
            {
                id: 234,
                name: 'Product Name 2',
                qty: 3
            }
        ]
    }
}
