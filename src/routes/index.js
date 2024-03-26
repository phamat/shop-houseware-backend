const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
    app.use('/user', UserRouter)
    app.use('/product', ProductRouter)
    app.use('/order', OrderRouter)
    app.use('/payment', PaymentRouter)
}

module.exports = routes