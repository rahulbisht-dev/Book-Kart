"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent,  DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent ,  TabsList, TabsTrigger  } from "@/components/ui/tabs";
import { Base_URL, useForgotPasswordMutation, useLoginMutation, useRegisterMutation} from "@/store/Api/Api";
import { authStatus, toggleLoginDialog } from "@/store/slice/UserSlice";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  agreeTerms:boolean;
}

interface ForgetPasswordFormData {
  email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {


  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [ForgotPassword] = useForgotPasswordMutation();
  
  const dispatch = useDispatch();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setforgotPassword] = useState(false);
  const [loginLoading, setloginLoading] = useState(false);
  const [signupLoading, setsignupLoading] = useState(false);
  const [googleLoading, setgoogleLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPassowordLoading, setForgotPasswordLoading] = useState(false);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: LoginError } } = useForm<LoginFormData>();
  const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: SignUpError } } = useForm<SignUpFormData>();
  const { register: registerForgotPassword, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordError } } = useForm<ForgetPasswordFormData>();

 
  //$ => function to handle login submit
  const onSubmitLogin = async (data: LoginFormData) => {
    setloginLoading(true);
    
    try {
      const result = await login(data).unwrap();

      if(result.success){
        toast.success(result.message);
        dispatch(toggleLoginDialog());
        dispatch(authStatus());
        window.location.reload();
      }

    } catch (error:any) {
      toast.error(error.data.message);
      dispatch(toggleLoginDialog());
    } finally {
      setloginLoading(false);
    }
  };



  //$ => function to Login with google.

  const handleGoogleLogin = async() =>{
    setgoogleLoading(true);

    try{
      router.push(`${Base_URL}/auth/google`);
      dispatch(authStatus());
      dispatch(toggleLoginDialog());
      setTimeout(() => {
        toast.success("Successfully logged in");
        dispatch(toggleLoginDialog());
      }, 3000);
    }
    catch(error){
      console.log(error);
      toast.error("Email and Password is Incorrect");
    }
    finally{
      setloginLoading(false);
    }
  }
  

  // $ => function to handle the forgot password tab.

  const onSubmitForgotPassword = async(data:ForgetPasswordFormData) =>{
    setForgotPasswordLoading(true);

    try{
      const result = await ForgotPassword(data.email).unwrap();

      if(result.success){
        toast.success(result.message);
        setForgotPasswordSuccess(true);
      }
    }
    catch(error){
      console.log(error);
      toast.error("failed to send the password reset link..please try again later..")
    }
    finally{
      setForgotPasswordLoading(false);
    }

  }


  //$ => function to handle signup submit
 
 
  const onSubmitSignUp = async (Data: SignUpFormData) => {
    setsignupLoading(true);

    try {
      const { email, password, name , agreeTerms} = Data;
      const result = await register({ email, password, name , agreeTerms}).unwrap();

      
      if(result.success) {
        toast.success(result.message);
        dispatch(toggleLoginDialog());
      }

    } 
    catch(error:any){
      toast.error(error?.data?.message || "Failed to register");
      dispatch(toggleLoginDialog());
    } 
    finally {
      setsignupLoading(false);
    }
  };





  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[425px] ">

        <DialogHeader>

          <DialogTitle className="text-center text-2xl font-bold mb-4">
            Welcome to Book Kart
          </DialogTitle>
        

        <Tabs value={currentTab} onValueChange={(value) =>setCurrentTab(value as "login" | "signup" | "forgot")} className="flex flex-col gap-8">

          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign-up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>

              <TabsContent value="login" className="space-y-8">

                {/* LOGIN FORM */}

                <form className="space-y-4" onSubmit={handleLoginSubmit((data) => onSubmitLogin(data))}>

                  <div className="relative">
                    <Input {...registerLogin("email", {required: "email is required"})} placeholder="Email" type="Email" className="pl-10"/>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                  {LoginError.email && (
                    <p className="text-red-500">{LoginError.email.message}</p>
                  )}


                  <div className="relative">
                    <Input {...registerLogin("password", {required: "Password is required"})} placeholder="Password" type={showPassword ? "text" : "password"} className="pl-10"/>
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    )}
                  </div>
                  {LoginError.password && (
                    <p className="text-red-500">
                      {LoginError.password.message}
                    </p>
                  )}

                  <Button type="submit" className="w-full font-bold">
                    {loginLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="mx-2 text-gray-500 text-sm">Or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <Button className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300" onClick={handleGoogleLogin}>
                  {googleLoading 
                  ? (<Loader2 className="animate-spin mr-2" size={20} />) 
                  : (
                    <>
                      <Image
                        src="/icons/google.svg"
                        width={20}
                        height={20}
                        alt="google"
                      />
                      Login With Google
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Sign-up Form */}

              <TabsContent value="signup" className="space-y-4">
                <form className="space-y-4" onSubmit={handleSignUpSubmit((data) => onSubmitSignUp(data))}>
                  <div className="relative">
                    <Input {...registerSignUp("name", {required: "name is required"})} placeholder="Full Name" type="text" className="pl-10"/>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                  {SignUpError.name && (
                    <p className="text-red-500">{SignUpError.name.message}</p>
                  )}

                  <div className="relative">
                    <Input {...registerSignUp("email", {required: "email is required"})} placeholder="Email" type="Email" className="pl-10"/>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                  </div>
                  {LoginError.email && (
                    <p className="text-red-500">{LoginError.email.message}</p>
                  )}

                  <div className="relative">
                    <Input {...registerSignUp("password", {required: "Password is required"})} placeholder="Password" type={showPassword ? "text" : "password"} className="pl-10"/>
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    )}
                  </div>
                  {LoginError.password && (
                    <p className="text-red-500">
                      {LoginError.password.message}
                    </p>
                  )}

                  <div className="flex items-center">
                    <Input {...registerSignUp("agreeTerms", {required: "you must agree to our terms and conditions"})} type="checkbox" className="pl-12 mr-5 w-4"/>
                    <label className="text-sm text-gray-700">
                      I agree to the Terms And Conditions
                    </label>
                  </div>

                  {SignUpError.agreeTerms && (
                    <p className="text-red-500">
                      {SignUpError.agreeTerms.message}
                    </p>
                  )}

                  <Button type="submit" className="w-full font-bold">
                    {signupLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Sign-up"
                    )}
                  </Button>
                </form>
              </TabsContent>


              {/* Forgot Password */}

              <TabsContent value="forgot" className="space-y-4">
                {!forgotPasswordSuccess ? (
                  <form className="space-y-4" onSubmit={handleForgotPasswordSubmit(onSubmitForgotPassword)}>
                    <div className="relative">
                      <Input
                        {...registerForgotPassword("email", {
                          required: "email is required",
                        })}
                        placeholder="Email"
                        type="Email"
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    {forgotPasswordError.email && (
                      <p className="text-red-500">
                        {forgotPasswordError.email.message}
                      </p>
                    )}

                    <Button type="submit" className="w-full font-bold">
                      {forgotPassowordLoading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-700">
                      Reset Link Sent Successfully
                    </h3>
                    <p className="ext-gray-500">
                      We've sent a password reset link to your email. Please
                      check your inbox and follow the instructions to reset your
                      password.
                    </p>
                    <Button
                      onClick={() => setForgotPasswordSuccess(false)}
                      className="w-full"
                    >
                      Send email Again
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <p className="text-sm text-center text-gray-600">
          By Clicking "agree" , you agree to our {" "}
          <Link href="/terms-of-use" className="text-blue-500 hover:underline">
            Terms-Of-Use {" "}
          </Link>
          And
          <Link
            href="/privacy-policy"
            className="text-blue-500 hover:underline"
          >
           {" "} Privacy-Policy
          </Link>
        </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPage;
