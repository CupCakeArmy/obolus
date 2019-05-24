import React, { useEffect, useRef, useState } from 'react'

import { withAuthSync } from '../utils/auth'
import Layout from '../components/layout'
import { callAPI, useCallAPI } from '../utils/api'
import Item from '../components/item'


const List = ({ fetched }) => {

    const input = useRef(undefined)
    const [text, setText] = useState('')
    const [data, refresh] = useCallAPI({ url: `/api/items` })

    useEffect(() => {
        if (!input.current) return
        input.current.focus()
    }, [input])

    const _submit = async (e) => {
        e.preventDefault()
        await callAPI(null, {
            url: `/api/items/`,
            method: 'post',
            data: { text },
        })
        setText('')
        refresh()
    }

    const _clear = () => callAPI(null, {
        url: `/api/items/`,
        method: 'delete',
    }).then(refresh)

    const items = data || fetched

    return <Layout>
        <form onSubmit={_submit}>
            <div className="input-group">
                <input
                    type="text" className="form-input" placeholder="..." ref={input}
                    value={text} onChange={e => setText(e.target.value)}/>
                <button type="submit" className="btn btn-primary input-group-btn">Add</button>
            </div>
        </form>
        <br/>
        <table className="table table-hover">
            <tbody>
            {items.map((item, i) => <Item key={i} {...item} refresh={refresh}/>)}
            </tbody>
        </table>
        <br/>
        <button onClick={_clear} className="btn btn-error">Delete All</button>
    </Layout>
}

List.getInitialProps = async ctx => ({
    fetched: await callAPI(ctx, { url: `/api/items` }),
})

export default withAuthSync(List)