import { type InjectionKey } from 'vue'
import { type HblProduct } from '@/utils/types'

export const hblDetailData = Symbol('hblDetailData') as InjectionKey<HblProduct>
