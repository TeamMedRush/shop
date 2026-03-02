"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
    id: number;
    email: string | null;
    phone: string | null;
    role: string;
    is_active: boolean;
}

export function useAuth(requireAuth = false) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me')
                if (!res.ok) {
                    throw new Error('Not authenticated')
                }
                const data = await res.json()
                setUser(data)
            } catch (err) {
                if (requireAuth) {
                    router.push('/auth')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [requireAuth, router])

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setUser(null)
            router.push('/auth')
            router.refresh()
        } catch (err) {
            console.error("Logout failed", err)
        }
    }

    return { user, loading, error, logout }
}
