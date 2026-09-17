import { Check, Mail } from "lucide-react";
import { CircleCheckBig } from 'lucide-react';
import { Button } from "../../../components/ui/button";

export default function CreatorApplicationSubmittedStep({ onContinue, loading = false }) {
  return (
    <div className="flex flex-col items-center px-2 py-4 text-center sm:px-6 sm:py-6">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#3ecf8e]"
        aria-hidden
      >
        <div className="relative flex  items-center justify-center rounded-full ">
          <CircleCheckBig
            className="h-10 w-10 text-white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </div>
      </div>

      <h2 className="mb-3 text-2xl font-bold tracking-tight text-[#161C2B] sm:text-[1.65rem]">
        Application Submitted!
      </h2>

      <p className="mb-8 max-w-md text-sm leading-relaxed text-[#5B576F] sm:text-[0.95rem]">
      Thank you for applying to become a Creator on Creatrend! We are absolutely thrilled to review your profile, and our team will be in touch shortly.
      </p>

      <div className="mb-8 flex w-full max-w-md items-start gap-3 rounded-xl bg-[#eef4fa] px-4 py-4 text-left">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#0c7bb3]" aria-hidden />
        <p className="text-sm leading-relaxed text-[#5B576F]">
        Keep an eye on your inbox—if your application is approved, we will send you an email with all the next steps to get your profile set up and ready to go.
        </p>
      </div>

      <Button
        disabled={loading}
        onClick={onContinue}
        className="rounded-xl px-5 btn-gradient w-full"
      >
        Back to Login
      </Button>

      <p className="mt-8 text-xs text-[#94A3B8]">
        Questions? Contact us at{" "}
        <a
          href="mailto:support@creatrend.co.za"
          className="text-[#94A3B8] hover:text-[#0c7bb3] hover:underline"
        >
          support@creatrend.co.za
        </a>
      </p>
    </div>
  );
}
