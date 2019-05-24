import { callAPI } from '../utils/api'
import React from 'react'


const Item = ({ id, text, done, refresh }) => {

    const _done = () => callAPI(null, {
        url: `/api/items/${id}`,
        method: 'patch',
        data: {
            done: !done,
        },
    }).then(refresh)

    const _delete = (e) => callAPI(null, {
        url: `/api/items/${id}`,
        method: 'delete',
    }).then(refresh)

    return <tr className="item" onClick={_done}>
        <td className="item-done">
            <div className="form-group">
                <label className="form-checkbox">
                    <input type="checkbox" checked={done} readOnly/>
                    <i className="form-icon"/>
                </label>
            </div>
        </td>
        <td>{text}</td>
        <td className="item-menu">
            <button className="btn btn-action btn-error" onClick={_delete}>
                <i className="icon icon-delete"/>
            </button>
        </td>
        {/* language=CSS */}
        <style jsx>{`
            .item-done {
                width: 2em;
            }

            .item-menu {
                width: 1em;
            }
        `}</style>
    </tr>
}

export default Item