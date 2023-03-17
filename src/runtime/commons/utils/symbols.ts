import { InjectionKey } from 'vue'
import { HblProduct } from '@/utils/types'

export const detailData = Symbol('detailData') as InjectionKey<HblProduct>
