import Router from 'koa-router'

import item from './item'
import purchase from './purchase'
import user from './user'

const r = new Router({
	prefix: '/api',
})

r.use(user.routes(), user.allowedMethods())
r.use(purchase.routes(), purchase.allowedMethods())
r.use(item.routes(), purchase.allowedMethods())

export default r