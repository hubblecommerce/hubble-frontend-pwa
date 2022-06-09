import { useState } from '#app'

export const useFoo = () => {
    return useState('foo', () => 'bar')
}
