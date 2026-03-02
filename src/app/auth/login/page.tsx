"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function EmailLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || 'Login failed')

            window.location.href = 'http://localhost:3000'
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <Link href="/auth" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in with Email</h1>
                <p className="text-gray-500 text-sm mb-6">Enter your details to access your account</p>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Log In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="font-medium text-cyan-600 hover:text-cyan-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
