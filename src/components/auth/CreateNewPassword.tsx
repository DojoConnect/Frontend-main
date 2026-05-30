import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { resetPassword } from "@/services/auth.service";

export default function CreateNewPassword({
  onContinue,
  email,
  otp,
  resetToken,
}: {
  onContinue: () => void;
  email: string;
  otp: string;
  resetToken: string;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFilled = password && confirm && password === confirm;

  const handleContinue = async () => {
    if (!isFilled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await resetPassword(password, resetToken);
      console.log('Password reset successful:', response);
      onContinue(); // go to success step
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Error resetting password";
      setError(errorMessage);
      console.error('Password reset error:', err);
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
          <h2 className="text-lg text-[#0F1828] font-semibold mb-2 text-center">Create new password</h2>
          <label className="block text-[#0F1828] mb-1 text-sm font-medium">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-md px-3 border border-gray-200 h-12 text-sm placeholder:text-gray-400 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 disabled:opacity-50"
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
          </div>
          <label className="block text-[#0F1828] mb-1 text-sm font-medium">Confirm password</label>
          <div className="relative mb-4">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              disabled={loading}
              className="w-full rounded-md px-3 border border-gray-200 h-12 text-sm placeholder:text-gray-400 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 disabled:opacity-50"
            >
              {showConfirm ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
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
            onClick={handleContinue}
          >
            {loading ? "Resetting..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}