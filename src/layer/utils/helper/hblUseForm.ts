export const hblUseForm = function () {
    // @ts-ignore
    async function validateForm (form) {
        const isValid = await form.checkValidity()

        if (!isValid) {
            form.reportValidity()
            return false
        }

        return true
    }

    return {
        validateForm
    }
}
