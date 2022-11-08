// @ts-ignore
export function registerIntersectionObserver (targetElement, callback, options = { rootMargin: '20px', threshold: 0.01 }) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback()
                observer.disconnect()
            }
        })
    }, options)
    observer.observe(targetElement)
}
