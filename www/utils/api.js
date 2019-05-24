import { useEffect, useState } from 'react'
import nextCookie from 'next-cookies'
import axios from 'axios'
import cookie from 'js-cookie'
import Router from 'next/dist/lib/router'


export const callAPI = async (ctxOrNull, { url, method, data }) => {

    // Whether ctx is set or not
    const token = ctxOrNull
        ? nextCookie(ctxOrNull).token
        : cookie.get('token')

    const redirect = () => process.browser
        ? Router.push('/login')
        : ctxOrNull.res.writeHead(302, { Location: '/login' }).end()

    const response = await axios({
        method: method || 'get',
        url,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        data,
    })

    if (response.status === 401) redirect()
    else return response.data.body
}

export const useCallAPI = (call, automatic = false) => {
    const [data, setData] = useState(undefined)

    const refresh = () => {
        callAPI(null, call).then(setData)
    }

    if (automatic)
        useEffect(() => {
            refresh()
        }, [0])

    return [data, refresh]
}