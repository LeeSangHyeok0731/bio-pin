"use client";

import { useState } from "react";

function BiometricLoginButton() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkSupport = async () => {
    if (window.location.protocol !== "https:") {
      setStatus("❌ HTTPS 환경에서만 사용 가능");
      return false;
    }

    if (!window.PublicKeyCredential) {
      setStatus("❌ 이 브라우저는 패스키를 지원하지 않음");
      return false;
    }

    const available =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

    if (!available) {
      setStatus("❌ 이 기기에는 생체인증 수단이 없음");
      return false;
    }

    return true;
  };

  // ✅ 패스키 생성 (회원가입용)
  const handleRegister = async () => {
    setStatus("");
    setIsLoading(true);

    if (!(await checkSupport())) {
      setIsLoading(false);
      return;
    }

    try {
      // ⚠️ 실제로는 서버에서 받아야 함
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "My Service",
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: "user@example.com",
            displayName: "User",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // 💡 이 옵션이 Windows Hello(플랫폼 인증기)를 강제합니다
            residentKey: "required",
            userVerification: "required",
          },
        },
      });

      console.log("패스키 생성:", credential);
      setStatus("✅ 패스키 등록 완료");
    } catch (err: any) {
      console.error(err);

      if (err.name === "NotAllowedError") {
        setStatus("⚠️ 사용자가 취소함");
      } else {
        setStatus("❌ 패스키 등록 실패");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 패스키 로그인
  const handleLogin = async () => {
    setStatus("");
    setIsLoading(true);

    if (!(await checkSupport())) {
      setIsLoading(false);
      return;
    }

    try {
      // ⚠️ 실제로는 서버에서 받아야 함
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
        },
      });

      console.log("로그인 성공:", credential);
      setStatus("✅ 패스키 로그인 성공");
    } catch (err: any) {
      console.error(err);

      if (err.name === "NotAllowedError") {
        setStatus("⚠️ 사용자가 취소함");
      } else if (err.name === "NotSupportedError") {
        setStatus("❌ 이 기기는 지원 안 함");
      } else {
        setStatus("❌ 로그인 실패");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button onClick={handleRegister} disabled={isLoading}>
        패스키 등록
      </button>

      <button onClick={handleLogin} disabled={isLoading}>
        패스키 로그인
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default BiometricLoginButton;
