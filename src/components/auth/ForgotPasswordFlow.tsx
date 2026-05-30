"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordStep from "./ForgotPassword";
import VerifyOtpStep from "./VerifyOtp";
import CreateNewPasswordStep from "./CreateNewPassword";
import PasswordResetSuccessStep from "./PasswordResetSuccess";



export default function ForgotPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

   return (
    <>
      {step === 1 && (
        <ForgotPasswordStep
          onContinue={(enteredEmail: string) => {
            setEmail(enteredEmail);
            setStep(2);
            }}
          />
          )}
          {step === 2 && (
          <VerifyOtpStep
            email={email}
            onVerify={(enteredOtp: string, token: string) => {
            setOtp(enteredOtp);
            setResetToken(token);
            setStep(3);
            }}
          />
          )}
        
      {step === 3 && (
        <CreateNewPasswordStep
          onContinue={() => setStep(4)}
          email={email}
          otp={otp}
          resetToken={resetToken}
        />
      )}
      {step === 4 && (
        <PasswordResetSuccessStep onLogin={() => router.push('/')} />
      )}
    </>
  );
}