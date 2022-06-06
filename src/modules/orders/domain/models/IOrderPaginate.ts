import { IOrder } from "@modules/orders/domain/models/IOrders"

export interface IOrderPaginate {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: IOrder[]
}