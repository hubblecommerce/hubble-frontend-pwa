import { Category } from './Category'

export interface Page {
    id: string,
    type: string,
    data: any,
    category?: Category
}
