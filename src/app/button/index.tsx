"use client";

import { useState } from "react";

function BiometricLoginButton() {
  const [status, setStatus] = useState("");

  const handleLogin = async () => {
    setStatus("");

    // 1. HTTPS 체크 (WebAuthn 필수)
    if (window.location.protocol !== "https:") {
      setStatus("❌ HTTPS 환경에서만 생체인증 사용 가능");
      return;
    }

    // 2. 브라우저 지원 여부
    if (!window.PublicKeyCredential) {
      setStatus("❌ 이 브라우저는 생체인증을 지원하지 않음");
      return;
    }

    try {
      // 3. 서버에서 challenge 받아왔다고 가정
      // 실제론 fetch("/api/auth/challenge") 해야 함
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
        return;
      }

      // 4. 서버로 전송 (예시)
      /*
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      if (!res.ok) throw new Error("서버 인증 실패");
      */

      console.log("인증 성공:", credential);
      setStatus("✅ 생체인증 로그인 성공");
    } catch (err) {
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
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>🔐 지문/얼굴로 로그인</button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default BiometricLoginButton;
