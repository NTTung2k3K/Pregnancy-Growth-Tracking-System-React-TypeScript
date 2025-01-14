import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthForm = () => {
  const [openDialog, setOpenDialog] = useState<"login" | "signup" | null>(null);

  const openLogin = () => setOpenDialog("login");
  const openSignup = () => setOpenDialog("signup");
  const closeDialog = () => setOpenDialog(null);

  return (
    <>
      <div
        onClick={openLogin}
        className="mr-2 text-sm font-bold px-2 border-r-2 border-sky-950 hover:underline hover:cursor-pointer"
      >
        <p>Log in</p>
      </div>
      <div
        onClick={openSignup}
        className="text-sm font-bold hover:underline hover:cursor-pointer"
      >
        <p>Sign up</p>
      </div>

      <LoginForm
        isOpen={openDialog === "login"}
        onClose={closeDialog}
        onSwitchToSignup={openSignup}
      />

      <SignupForm
        isOpen={openDialog === "signup"}
        onClose={closeDialog}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default AuthForm;
