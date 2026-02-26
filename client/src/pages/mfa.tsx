import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck, RefreshCw, Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useToast } from "@/hooks/use-toast";

export default function MfaPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(true);
  const [otp, setOtp] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem("mediportal_user");
    if (!userStr) {
      setLocation("/login");
      return;
    }
    const user = JSON.parse(userStr);
    const phone = user.phone || "";
    if (phone.length >= 4) {
      setMaskedPhone("***-***-" + phone.replace(/\D/g, "").slice(-4));
    } else {
      setMaskedPhone("your registered number");
    }

    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Code Sent",
        description: "A 6-digit verification code has been sent to your phone.",
      });
    }, 1500);
  }, []);

  const handleResend = () => {
    setIsSending(true);
    setOtp("");
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your phone.",
      });
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-[440px] shadow-md border-slate-200 bg-white transition-all">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pt-10 pb-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300 delay-150">
            {isSending ? (
              <Smartphone className="w-8 h-8 text-primary animate-pulse" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-primary" />
            )}
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {isSending ? "Sending Code..." : "Verify It's You"}
            </CardTitle>
            <CardDescription className="text-slate-500 text-base max-w-[300px] mx-auto">
              {isSending ? (
                "Sending a verification code to your mobile phone..."
              ) : (
                <span>
                  Enter the 6-digit code sent to <br/>
                  <span className="font-semibold text-slate-700">{maskedPhone}</span>
                </span>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isSending ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-8 flex flex-col items-center animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className="flex justify-center w-full">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  data-testid="input-otp"
                >
                  <InputOTPGroup className="gap-2">
                    {/* Dark border on each OTP slot, thicker when focused */}
                    <InputOTPSlot index={0} className="h-12 w-10 border-2 border-slate-700 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md text-slate-900 font-semibold" />
                    <InputOTPSlot index={1} className="h-12 w-10 border-2 border-slate-700 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md text-slate-900 font-semibold" />
                    <InputOTPSlot index={2} className="h-12 w-10 border-2 border-slate-700 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md text-slate-900 font-semibold" />
                  </InputOTPGroup>
                  <div className="w-4" />
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={3} className="h-12 w-10 border-2 border-slate-700 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md text-slate-900 font-semibold" />
                    <InputOTPSlot index={4} className="h-12 w-10 border-2 border-slate-700 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md text-slate-900 font-semibold" />
                    <InputOTPSlot index={5} className="h-12 w-10 border-2 border-slate-700 bg-slate-50 focus:bg-white focus:border-primary transition-all duration-200 shadow-sm rounded-md text-slate-900 font-semibold" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isLoading || otp.length !== 6}
                data-testid="button-verify"
              >
                {isLoading ? "Verifying..." : "Verify Identity"}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8 bg-slate-50/50 rounded-b-xl border-t border-slate-100">
          {!isSending && (
            <div className="text-center text-sm text-slate-500 animate-in fade-in slide-in-from-bottom-2">
              Didn't receive the code?{" "}
              <button
                className="font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors ml-1 inline-flex items-center"
                onClick={handleResend}
                data-testid="button-resend"
              >
                Resend code <RefreshCw className="ml-1 w-3 h-3" />
              </button>
            </div>
          )}

          <div className="text-center">
            <Link href="/login">
              <span className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition-colors inline-flex items-center">
                <ArrowLeft className="mr-1 w-3 h-3" /> Back to sign in
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}