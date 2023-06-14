import { InjectionKey } from 'vue'
import { HblProduct } from '@/utils/types'

export const hblDetailData = Symbol('hblDetailData') as InjectionKey<HblProduct>
