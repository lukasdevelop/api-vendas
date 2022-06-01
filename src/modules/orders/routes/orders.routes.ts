import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import OrdersController from '../controllers/OrderController'
import isAuthenticated from '@shared/http/middlewares/isAuthenticated'

const ordersRouter = Router()
const ordersController = new OrdersController()

ordersRouter.use(isAuthenticated)

ordersRouter.get('/:id', celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required()
  }
}), ordersController.show)

ordersRouter.post('/', celebrate({
  [Segments.BODY]: {
    customer_id: Joi.string().required(),
    products: Joi.required()
  }
}), ordersController.create)



export default ordersRouter
