// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react'

const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            },
            { threshold: 0.1, ...options }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [options])

    return [ref, isIntersecting] as const
}

export default useIntersectionObserver
