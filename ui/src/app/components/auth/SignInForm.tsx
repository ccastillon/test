"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { IconContext } from "react-icons";
import { FaCircleExclamation } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa"

interface Props {
  callbackUrl: string | string[] | undefined;
}

const FormSchema = z.object({
  email: z.string().email("Email address is required."),
  password: z.string({ required_error: "Password is required." }).min(1, "Password is required."),
});

type InputType = z.infer<typeof FormSchema>;

export default function SignInForm(props: Props) {
  const errorAlertAtr = { alert: "" };
  const router = useRouter();
  const [visible, setVisibility] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    mode: "onSubmit",
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!result?.ok) {
      setDisplayError(true);
      return;
    }

    const callbackUrl = props.callbackUrl?.includes("auth") || props.callbackUrl?.includes("rules") ? "/upcoming-events" : props.callbackUrl;

    router.refresh();

    if (callbackUrl && typeof callbackUrl == "string") {
      router.push(callbackUrl as string);
    } else if (!callbackUrl) {
      router.push("/upcoming-events");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {displayError && (
        <div
          {...errorAlertAtr}
          id="errorAlert"
          className="relative p-4 pr-12 mb-4 text-black border border-red-300 border-solid rounded-lg bg-red-100 text-xs text-start"
        >
          <IconContext.Provider value={{ color: "red", size: "2em" }}>
            <span>
              <FaCircleExclamation />
            </span>
          </IconContext.Provider>
          &nbsp; &nbsp; Incorrect email or password. Please try again.
        </div>
      )}
      <div className={`${ errors.email ? "mb-0" : "mb-4"}`}>
        <input
          {...register("email")}
          placeholder="Email"
          className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      <div className="mb-4 text-sm text-left">
        <span className="text-red-500">{errors.email?.message}</span>
      </div>
      <div className={`relative ${ errors.password ? "mb-0" : "mb-4"}`}>
        {/* <PasswordInput /> */}
        <div className="flex justify-between items-center w-full">
          <input
            {...register("password")}
            placeholder="Password"
            type={visible ? "text" : "password"}
            autoComplete="off"
            className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          ></input>
          <div className="p-2 absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setVisibility(!visible)}>
            {visible ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
          </div>
        </div>
      </div>
      <div className="mb-4 text-sm text-left">
        <span className="text-red-500">{errors.password?.message}</span>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-block w-full px-6 py-3 mt-3 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
