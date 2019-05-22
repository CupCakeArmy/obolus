import JWT from 'jsonwebtoken'
import Router from 'koa-router'

import User from '../entities/user'
import { withAuth } from '../lib/auth'
import { Config, JWTConfig } from '../lib/config'
import { FailureBadRequest, FailureUnauthorized, Success } from '../lib/responses'

const r = new Router({
	prefix: '/users',
})

const allowedUsers = Config.get<string[]>('users')
const secret = Config.get<string>('security.password')

r.get('/', withAuth(async (ctx) =>
	Success(ctx, await User.find()),
))

r.get('/names', async (ctx) =>
	Success(ctx, (await User.find()).map(user => user.name)),
)

r.get('/me', withAuth(async (ctx) =>
	Success(ctx, await User.getFromName(ctx.state.user.name, true)),
))

r.post('/me/avatar', withAuth(async (ctx) => {
	const { avatar } = ctx.request.body
	ctx.state.user.avatar = String(avatar)
	await ctx.state.user.save()
	return Success(ctx)
}))

r.post('/login', async (ctx) => {
	const { user, password } = ctx.request.body

	if (!user || !password) return FailureBadRequest(ctx)

	if (!allowedUsers.includes(user.toLowerCase()) || password != secret)
		return FailureUnauthorized(ctx)

	await User.createOrGet(user)
	const token = JWT.sign({ user }, JWTConfig.secret, JWTConfig.options)
	return Success(ctx, { token })
})

export default r