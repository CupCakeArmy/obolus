import Router from 'koa-router'
import Purchase from '../entities/purchase'

import User from '../entities/user'
import { withAuth } from '../lib/auth'
import { FailureBadRequest, FailureForbidden, Success } from '../lib/responses'

const r = new Router({
	prefix: '/purchases',
})

r.get('/', withAuth(async (ctx) => {
	return Success(ctx, await Purchase.find({ order: { when: 'DESC' } }))
}))

r.post('/', withAuth(async (ctx) => {
	const { price, debtors, description } = ctx.request.body

	if (isNaN(price) || price < 0) return FailureBadRequest(ctx, 'Price should be numeric and positive')
	if (!Array.isArray(debtors) || debtors.length < 1) return FailureBadRequest(ctx, 'Debtors needs to be an array and at least contain one debtor')

	const Debtors: User[] = []
	try {
		for (const debtor of debtors)
			Debtors.push(await User.getFromName(debtor))
	} catch (e) {
		return FailureBadRequest(ctx, 'Could not find users')
	}

	const purchase = await new Purchase(price, ctx.state.user, Debtors, String(description)).save()

	return Success(ctx, purchase)
}))

r.delete('/:id', withAuth(async (ctx) => {
	const { id } = ctx.params
	const purchase = await Purchase.findOne({ where: { id } })

	if (!purchase) return

	if (ctx.state.user.id !== purchase.payer.id) return FailureForbidden(ctx)

	await purchase.remove()
	return Success(ctx)
}))

r.get('/stats', withAuth(async (ctx) => {
	return Success(ctx, await Purchase.getCurrentStats())
}))

export default r