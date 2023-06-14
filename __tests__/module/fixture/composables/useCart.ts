import { ref } from 'vue'

export const useCart = function () {
    const cart = ref('overridden component value')

    return {
        cart
    }
}
