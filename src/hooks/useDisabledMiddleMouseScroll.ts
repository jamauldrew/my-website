import { useEffect, RefObject } from 'react'

const useDisableMiddleMouseScroll = (ref: RefObject<HTMLElement>) => {
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 1) {
                e.preventDefault()
            }
        }

        const currentRef = ref.current
        if (currentRef) {
            currentRef.addEventListener('mousedown', handleMouseDown)
            return () => {
                currentRef.removeEventListener('mousedown', handleMouseDown)
            }
        }
    }, [ref])
}

export default useDisableMiddleMouseScroll
