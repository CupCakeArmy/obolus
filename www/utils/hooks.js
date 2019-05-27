import React, { useEffect, useState } from 'react'


export const useLocalStorageWatcher = (fn) => {
    useEffect(() => {
        window.addEventListener('storage', fn)

        return () => {
            window.removeEventListener('storage', fn)
        }
    }, [])
}

export const editableWhenOnline = () => {
    const [online, setOnline] = useState(window.navigator.onLine)

    useEffect(() => {
        const onlineHandler = () => setOnline(true)
        const offlineHandler = () => setOnline(false)
        window.addEventListener('online', onlineHandler)
        window.addEventListener('offline', offlineHandler)

        return () => {
            window.removeEventListener('online', onlineHandler)
            window.removeEventListener('offline', offlineHandler)
        }
    }, [])

    useEffect(() => {
        const elements = window.document.querySelectorAll('input, button')
        for (const element of elements)
            element.disabled = !online
    }, [online])

    return online
}