import { callAPI } from '../utils/api'
import { formatPrice, timePassedSinceTimestamp } from './humanize'
import { capitalize, getAvatarOfFallback } from '../utils/misc'
import React from 'react'


const deletePurchase = id => callAPI(null, {
    url: `/api/purchases/${id}`,
    method: 'delete',
}).then(() => location.reload()).catch(() => alert('There was a problem deleting the purchase'))

const Purchase = ({ purchase, me }) => <div className="purchases-item tile tile-centered">
    <div className="tile-icon">
        <figure className="avatar avatar-lg">
            <img alt="avatar-icon" src={`/static/icons/animals/${getAvatarOfFallback(purchase.payer.avatar)}.svg`}/>
        </figure>
    </div>
    <div className="tile-content">
        <div className="tile-title">
            {formatPrice(purchase.price)}
            <small className={'float-right'}>{timePassedSinceTimestamp(purchase.when)}</small>
        </div>
        <small className="tile-subtitle text-gray">
            <b>{capitalize(purchase.payer.name)}</b>
            <span className={'float-right'}>
                                   {purchase.debtors.map(debtor => debtor.name).map(capitalize).join(' · ')}
                               </span>
        </small>
    </div>
    <div className="tile-action">
        <div className="dropdown dropdown-right">
            <a className="btn btn-link dropdown-toggle" tabIndex="0">
                <i className="icon icon-more-vert"/>
            </a>
            <ul className="menu">
                <li className="menu-item">
                    {purchase.payer.id === me.id
                        ? <a onClick={() => deletePurchase(purchase.id)}>
                            <i className="icon icon-delete"/> Delete
                        </a>
                        : <span>Only the payer can cancel the purchase</span>
                    }
                </li>
            </ul>
        </div>
    </div>

    {/* language=CSS */}
    <style jsx>{`
        .purchases-item {
            margin-bottom: 1.5em;
        }

        .purchases-item .tile-subtitle {
            display: block;
        }
    `}</style>
</div>

export default Purchase