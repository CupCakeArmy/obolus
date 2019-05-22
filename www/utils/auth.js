import React from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'

import { useLocalStorageWatcher } from './hooks'


export const login = ({ token }) => {
    cookie.set('token', token)
    Router.push('/me')
}

export const logout = () => {
    cookie.remove('token')

    // to support logging out from all windows
    window.localStorage.setItem('logout', Date.now().toString())
    Router.push('/login')
}


const syncLogout = (event) => {
    if (event.key !== 'logout') return

    window.localStorage.removeItem('logout')
    Router.push('/login')
}

export const withAuthSync = Wrapped => {

    const wrapper = (props) => {
        useLocalStorageWatcher(syncLogout)

        return <Wrapped {...props}/>
    }

    wrapper.getInitialProps = async (ctx) => {
        const token = auth(ctx)
        const componentProps = Wrapped.getInitialProps && await Wrapped.getInitialProps(ctx)
        return { ...componentProps, token }
    }

    return wrapper
}

export const auth = ctx => {
    const { token } = nextCookie(ctx)

    /*
     * This happens on server only, ctx.req is available means it's being
     * rendered on server. If we are on server and token is not available,
     * means user is not logged in.
     */
    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end()
        return
    }

    // We already checked for server. This should only happen on client.
    if (!token) {
        Router.push('/login')
    }

    return token
}
