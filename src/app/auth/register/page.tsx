"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function EmailRegister() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // 1. Register User
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, phone: phone || undefined })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || 'Registration failed')

            // 2. Auto-login after registration
            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!loginRes.ok) throw new Error('Registered, but auto-login failed. Please login manually.')

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
                <Link href="/auth/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to login
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
                <p className="text-gray-500 text-sm mb-6">Join MedRush to get medicines fast.</p>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Optional)</label>
                        <input
                            type="tel"
                            pattern="[0-9]{10}"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm outline-none"
                            placeholder="9876543210"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
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
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    )
}
