import React, { useEffect, useRef } from 'react'
import ChartJS from 'chart.js'
import { capitalize } from '../utils/misc'


const Chart = ({ stats }) => {

    const canvas = useRef(undefined)

    const { _error, ...users } = stats

    const chartColors = [
        'rgb(255,74,109)',
        'rgb(255,194,81)',
        'rgb(63,197,255)',
        'rgb(46,192,37)',
    ]

    const formatData = (data) => {
        const sorted = Object.entries(data).sort((a, b) => a[1] < b[1] ? 1 : -1)
        const positive = sorted.filter(([name, amount]) => amount >= 0).reverse()
        const negative = sorted.filter(([name, amount]) => amount < 0)

        const getProgressiveValues = (arr) => {
            if (arr.length === 0) return []

            const tmp = [arr[0]]
            let highest = arr[0][1]

            for (const cur of arr.slice(1)) {
                const delta = cur[1] - highest
                tmp.push([cur[0], delta])
                highest += delta
            }
            return tmp
        }

        return [
            ...getProgressiveValues(positive),
            ...getProgressiveValues(negative),
        ]
    }


    useEffect(() => {

        console.log(`Error margin: ${_error}`)

        // TODO: Consistent color scheme
        const data = {
            labels: ['Current'],
            datasets: formatData(users).map(([name, amount], i) => ({
                label: name,
                backgroundColor: chartColors[i],
                data: [amount],
            })),
        }

        const chart = new ChartJS(canvas.current, {
            type: 'horizontalBar',
            data,
            options: {
                tooltips: {
                    enabled: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        display: false,
                        stacked: true,
                    }],
                },
            },
        })

    }, [canvas])

    return <React.Fragment>
        <div className={'chart-container'}>
            <canvas ref={canvas}/>
        </div>
        <br/>
        <div className={'text-center'}>
            {Object.entries(users).map(([user, value], i) => <span key={i} className={'label m-1'}>
            {capitalize(user)} <b>{value}</b>
        </span>)}
            {/*<div className={'mt-2'}><small>Error margin:{_error}</small></div>*/}
        </div>

        {/* language=CSS */}
        <style jsx>{`
            .chart-container {
                width: 100%;
                height: 8em;
                position: relative;
            }
        `}</style>
    </React.Fragment>
}

export default Chart