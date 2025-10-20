import LoginForm from './login-form';
``
export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
