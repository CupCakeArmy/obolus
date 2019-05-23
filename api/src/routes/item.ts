import Router from 'koa-router'

import Item from '../entities/item'
import { withAuth } from '../lib/auth'
import { Success } from '../lib/responses'

const r = new Router({
	prefix: '/items',
})

r.get('/', withAuth(async ctx => {
	return Success(ctx, await Item.find())
}))

r.post('/', withAuth(async ctx => {
	const { text, done } = ctx.request.body

	return Success(ctx, await new Item(String(text), Boolean(done)).save())
}))

r.delete('/', withAuth(async ctx => {
	return Success(ctx, await Item.clear())
}))

r.get('/:id', withAuth(async ctx => {
	const { id } = ctx.params
	const item = await Item.findOne(id)

	// 404
	if (!item) return

	return Success(ctx, item)
}))

r.delete('/:id', withAuth(async ctx => {
	const { id } = ctx.params
	const item = await Item.findOne(id)

	// 404
	if (!item) return

	await item.remove()
	return Success(ctx)
}))

r.patch('/:id', withAuth(async ctx => {
	const { id } = ctx.params
	const item = await Item.findOne(id)

	// 404
	if (!item) return

	const { text, done } = ctx.request.body
	if (text !== undefined) item.text = String(text)
	if (done !== undefined) item.done = Boolean(done)

	return Success(ctx, await item.save())
}))

export default r