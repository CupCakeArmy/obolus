import Router from 'koa-router'

import purchase from './purchase'
import user from './user'

const r = new Router({
	prefix: '/api'
})

r.use(user.routes(), user.allowedMethods())
r.use(purchase.routes(), purchase.allowedMethods())

export default r