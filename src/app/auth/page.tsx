import Link from 'next/link'
import { ArrowRight, Smartphone, Mail } from 'lucide-react'

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-cyan-600 font-black text-2xl tracking-tighter">M+</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MedRush</h1>
                <p className="text-gray-500 text-sm mb-8">How would you like to log in?</p>

                <div className="space-y-4">
                    <Link href="/auth/otp" className="flex items-center justify-between p-4 rounded-xl border-2 border-cyan-500 bg-cyan-50/50 hover:bg-cyan-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                                <Smartphone size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Phone Number</p>
                                <p className="text-xs text-gray-500">Fastest — Login with OTP</p>
                            </div>
                        </div>
                        <ArrowRight size={18} className="text-cyan-600 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link href="/auth/login" className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                                <Mail size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Email Address</p>
                                <p className="text-xs text-gray-500">Sign in with password</p>
                            </div>
                        </div>
                        <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
