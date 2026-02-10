"use client";

import { useState } from "react";

function BiometricLoginButton() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setStatus("");
    setIsLoading(true);

    // 1. HTTPS 체크 (WebAuthn 필수)
    if (window.location.protocol !== "https:") {
      setStatus("❌ HTTPS 환경에서만 생체인증 사용 가능");
      setIsLoading(false);
      return;
    }

    // 2. 브라우저 지원 여부
    if (!window.PublicKeyCredential) {
      setStatus("❌ 이 브라우저는 생체인증을 지원하지 않음");
      setIsLoading(false);
      return;
    }

    try {
      // 3. 서버에서 challenge 받아왔다고 가정
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
        },
      });

      if (!credential) {
        setStatus("❌ 인증 정보 없음");
        setIsLoading(false);
        return;
      }

      console.log("인증 성공:", credential);
      setStatus("✅ 생체인증 로그인 성공");
    } catch (err: any) {
      console.error(err);

      // 5. 에러 종류별 처리
      if (err.name === "NotAllowedError") {
        setStatus("⚠️ 사용자가 인증을 취소했어요");
      } else if (err.name === "NotSupportedError") {
        setStatus("❌ 이 기기는 생체인증을 지원하지 않아요");
      } else if (err.name === "SecurityError") {
        setStatus("❌ 보안 에러 (HTTPS 아님 or 권한 문제)");
      } else if (err.name === "TimeoutError") {
        setStatus("⌛ 인증 시간이 초과됐어요");
      } else {
        setStatus("❌ 알 수 없는 오류 발생");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`group relative flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 transition-transform group-hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span>{isLoading ? "인증 중..." : "지문으로 로그인"}</span>
      </button>

      {status && (
        <div
          className={`flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
            status.includes("✅")
              ? "bg-green-500/20 text-green-100 ring-1 ring-green-500/50"
              : "bg-red-500/20 text-red-100 ring-1 ring-red-500/50"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default BiometricLoginButton;
