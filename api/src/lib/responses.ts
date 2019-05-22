import { Context, ParameterizedContext } from 'koa'

type ResponseContext = Context | ParameterizedContext

export const Success = (ctx: ResponseContext, msg?: any) => {
	ctx.body = {
		_error: false,
		body: msg,
	}
}

export const Failure = (ctx: ResponseContext, msg: any = 'Internal Error', code: number = 500) => {
	ctx.response.status = code
	ctx.body = { _error: msg }
}

export const FailureUnauthorized = (ctx: ResponseContext, msg: string = 'Unauthorized') => {
	Failure(ctx, msg, 401)
}

export const FailureForbidden = (ctx: ResponseContext, msg: string = 'Forbidden') => {
	Failure(ctx, msg, 403)
}

export const FailureBadRequest = (ctx: ResponseContext, msg: string = 'Bad Request') => {
	Failure(ctx, msg, 400)
}