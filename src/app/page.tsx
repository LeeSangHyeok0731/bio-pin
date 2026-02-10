import BiometricLoginButton from "./button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            생체 인증
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Securely log in with your fingerprint or face
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <BiometricLoginButton />
        </div>
      </div>
    </div>
  );
}
