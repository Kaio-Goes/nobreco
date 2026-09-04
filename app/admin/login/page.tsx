import LoginForm from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-azul-marinho px-6 py-24">
      <h1 className="text-2xl font-semibold text-off-white">Área restrita</h1>
      <LoginForm />
    </div>
  );
}
