import { InjectionKey } from 'vue'
import { Product } from '@hubblecommerce/hubble/commons'

export const detailData = Symbol('detailData') as InjectionKey<Product>
