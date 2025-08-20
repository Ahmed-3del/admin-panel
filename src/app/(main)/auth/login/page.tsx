import LoginForm from "./_components/login-form";

export default function page() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to log in to your account.
        </p>
      </div>
      <LoginForm />
      <p className="text-muted-foreground px-8 space-x-2 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <span
          // href="/#"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </span>
        and{" "}
        <span
          // href="/#"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
}
