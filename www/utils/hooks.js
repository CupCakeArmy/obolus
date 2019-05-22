import React, { useEffect } from 'react'


export const useLocalStorageWatcher = (fn) => {
    useEffect(() => {
        window.addEventListener('storage', fn)

        return () => {
            window.removeEventListener('storage', fn)
        }
    }, [])
}