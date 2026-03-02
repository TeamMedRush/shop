"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function OTPLogin() {
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            })
            if (!res.ok) throw new Error('Failed to send OTP')
            setStep('OTP')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code })
            })
            if (!res.ok) throw new Error('Invalid OTP')

            // Redirect to MedRush landing page after login
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {step === 'PHONE' ? 'Sign in with Phone' : 'Verify Phone'}
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    {step === 'PHONE'
                        ? 'We will send a 6-digit code to your number.'
                        : `Code sent to ${phone}`}
                </p>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm outline-none"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || phone.length !== 10}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm outline-none text-center tracking-[0.5em] font-mono font-bold"
                                placeholder="------"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                        </button>
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => setStep('PHONE')} className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                                Change number
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
