"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/lib/actions/authActions";
import { IdentityResult } from "user-module";
import ErrorMessageComp from "./ErrorMessage";
import { diff_years } from "@/lib/dateComparison";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FormSchema = z
  .object({
    name: z.string().min(1, "What's your name?").min(2, "Name must be at least 2 characters.").max(50, "Name must be less than 50 characters."),
    username: z
      .string()
      .min(1, "Username is required.")
      .min(6, "Your username must be at least 6-30 characters.")
      .max(30, "Your username must be at least 6-30 characters.")
      .regex(new RegExp("^[a-zA-Z0-9]+$"), "Sorry, only letters (a-z) and numbers (0-9) are allowed."),
    email: z.string().min(1, "Email address is required.").email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters."),
    dateOfBirth: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === "invalid_date" ? "Your birthday is required." : defaultError,
      }),
    }),
  })
  .superRefine(({ dateOfBirth }, checkBirthdate) => {
    const age = diff_years(dateOfBirth);

    if (age < 18) {
      checkBirthdate.addIssue({
        path: ["dateOfBirth"],
        code: "invalid_date",
        message: "You must be above 18 years old to sign up.",
      });
    }
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfLowerCase < 1 || countOfUpperCase < 1 || countOfSpecialChar < 1 || countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        path: ["password"],
        code: "custom",
        message: "Password requirements not met.",
      });
    }
  });

type InputTpe = z.infer<typeof FormSchema>;

interface ApiErrorProps {
  field: string;
  messages: any[];
}

export default function SignUpForm() {
  const router = useRouter();
  const dateTimePicker = { datetimepicker: "" };
  const [visible, setVisibility] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<InputTpe>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(FormSchema),
  });

  function setMultipleErrors(field: any, errors: any[]) {
    const types: any = {};
    errors.forEach((error, i) => {
      types[`apiError${i + 1}`] = error;
    });

    setError(field, {
      types,
    });
  }

  function handleApiErrors(apiErrors: any[]) {
    const newFormErrors: any = {};

    apiErrors.forEach(({ field, messages }: ApiErrorProps) => {
      messages.forEach((message) => {
        if (field in getValues()) {
          if (!newFormErrors[field]) {
            newFormErrors[field] = [];
          }

          newFormErrors[field].push(message);
        } else {
          if (!newFormErrors.__general__) {
            newFormErrors.__general__ = [];
          }

          newFormErrors.__general__.push(message);
        }
      });
    });

    Object.entries(newFormErrors).forEach(([field, errors]: [any, any]) => setMultipleErrors(field, errors));
  }

  function getApiErrors(result: IdentityResult, fieldName: string) {
    const errorDescriptions = result.errors.filter((x) => x.code.toLowerCase().includes(fieldName)).map((x) => x.description);

    const messages: string[] = [];

    errorDescriptions.forEach((desc) => {
      messages.push(desc);
    });

    const apiErrors: any[] = [{ field: fieldName, messages: messages }];

    handleApiErrors(apiErrors);
  }

  const saveUser: SubmitHandler<InputTpe> = async (data, event) => {
    event?.preventDefault();

    try {
      const response: IdentityResult = await registerUser(data);

      if (!response.succeeded) throw response;
      else if (response.succeeded) {
        router.push("/auth/account-created");
      }
    } catch (error) {
      console.error("Error: ", error);
      const result = error as IdentityResult;
      const errorCodes = result.errors.map((x) => x.code);

      if (errorCodes.some((x) => x.toLowerCase().includes("password"))) {
        getApiErrors(result, "password");
      }

      if (errorCodes.some((x) => x.toLowerCase().includes("username"))) {
        getApiErrors(result, "username");
      }

      if (errorCodes.some((x) => x.toLowerCase().includes("email"))) {
        getApiErrors(result, "email");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(saveUser)}>
      <div className="mb-4">
        <input
          {...register("name")}
          type="text"
          placeholder="Name"
          className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {/* <span className="text-red-500">{errors.name?.message}</span> */}
        <ErrorMessageComp errors={errors as any} fieldName="name" />
      </div>
      <div className="mb-4">
        <input
          {...register("username")}
          type="text"
          placeholder="Username"
          className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
        />
        <ErrorMessageComp errors={errors as any} fieldName="username" />
      </div>
      <div className="mb-4">
        <input
          {...register("email")}
          placeholder="Email"
          className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        <ErrorMessageComp errors={errors as any} fieldName="email" />
      </div>
      <div className="relative mb-4 text-start">
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
          <div className="p-2 absolute inset-y-0 right-0 pr-3 items-center cursor-pointer" onClick={() => setVisibility(!visible)}>
            {visible ? <i className="fa fa-eye" aria-hidden="true"></i> : <i className="fa fa-eye-slash" aria-hidden="true"></i>}
          </div>
        </div>
        <ErrorMessageComp errors={errors as any} fieldName="password" />
      </div>

      <div className="mb-4">
        <input
          {...register("dateOfBirth")}
          {...dateTimePicker}
          className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
            errors.dateOfBirth ? "border-red-500" : "border-gray-300"
          }`}
          type="date"
          placeholder="Date of birth"
        />
        <ErrorMessageComp errors={errors as any} fieldName="dateOfBirth" />
      </div>

      <div className="min-h-6 mb-0.5 block">
        <label className="mb-2 ml-1 font-normal text-left cursor-pointer select-none text-sm text-slate-700" htmlFor="terms">
          {" "}
          By clicking Sign Up, you confirm you agree to our{" "}
          <Link href="/rules" className="font-bold text-slate-700">
            Rules
          </Link>{" "}
          and are at least 18 years old.{" "}
        </label>
      </div>
      <div className="text-center">
        <button
          className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
}
