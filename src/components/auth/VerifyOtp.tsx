import { useState, useEffect } from "react";
import { verifyPasswordResetOtp } from "@/services/auth.service";

export default function VerifyOtp({ onVerify, email }: { onVerify: (otp: string, resetToken: string) => void; email: string }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const isFilled = otp.every(d => d !== "");

  const handleChange = (value: string, idx: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[idx] = value;
      setOtp(newOtp);
    }
  };

  const handleVerify = async () => {
    if (!isFilled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const otpCode = otp.join("");
      const response = await verifyPasswordResetOtp(email, otpCode);
      console.log('OTP verified:', response);
      
      // Pass both OTP and resetToken  to next step
      if (response.data?.resetToken) {
        onVerify(otpCode, response.data.resetToken);
      } else {
        setError('No reset token received');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Error verifying OTP";
      setError(errorMessage);
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 bg-[#E51B1B] justify-center items-center">
        <h1 className="text-white text-4xl font-bold">DojoConnect</h1>
      </div>
      <div className="flex flex-1 justify-center items-center bg-white p-4">
        <div className="w-full max-w-md p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg text-[#0F1828] font-semibold mb-2 text-center">Forgot password?</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            A 6-digit OTP (ONE TIME PASSWORD) has been sent to your e-mail for verification
          </p>
          <div className="flex justify-between mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                disabled={loading}
                className="w-10 h-12 rounded-md bg-gray-100 text-center text-lg text-gray-700 disabled:opacity-50"
                placeholder="-"
              />
            ))}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Didn't get code? <button className="text-red-500 underline" disabled={loading}>Resend</button>
            </span>
            <span className="text-sm text-gray-500">{`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`}</span>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
        className={`w-full h-12 rounded-md text-white font-semibold ${(isFilled && !loading) ? "bg-[#E51B1B]" : "bg-red-200"}`}
        disabled={!isFilled || loading}
        onClick={handleVerify}
      >
        {loading ? "Verifying..." : "Verify code"}
      </button>
        </div>
      </div>
    </div>
  );
}