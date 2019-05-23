import React from 'react'
import { Duration } from 'uhrwerk'


export const timePassedSinceTimestamp = since => new Duration(Date.now() - since, 'milliseconds').humanize() + ' ago'

export const formatPrice = price => {
    const [int, float] = price.toFixed(2).split('.')
    return <span className={'mr-1'}>
        <b>{int}
            <small>,{float}</small>
        </b>
    </span>
}
