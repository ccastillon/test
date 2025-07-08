"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ErrorMessageComp from "../auth/ErrorMessage";
import { IdentityResult } from "user-module";
import { changePassword } from "@/lib/actions/authActions";
import ErrorSuccessAlert from "../ErrorSuccessAlert";

const FormSchema = z
  .object({
    // id: z.string(),
    currentPassword: z.string().min(1, "Current Password is required."),
    //   .min(8, "Password must be at least 8 characters."),
    newPassword: z.string().min(1, "New Password is required.").min(8, "New Password must be at least 8 characters."),
  })
  .superRefine(({ newPassword }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < newPassword.length; i++) {
      let ch = newPassword.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfLowerCase < 1 || countOfUpperCase < 1 || countOfSpecialChar < 1 || countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        path: ["newPassword"],
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

export default function ChangePasswordForm() {
  const [visible, setVisibility] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
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
    console.log("getApiErrors result: ", result);
    let errorDescriptions: string[] = [];
    if (fieldName === "currentPassword") {
      errorDescriptions = result.errors.filter((x) => x.code.includes("PasswordMismatch")).map((x) => x.description === "Incorrect password." ? "The password you entered is incorrect." : x.description);
    } else if (fieldName === "newPassword") {
      errorDescriptions = result.errors.filter((x) => x.code.toLowerCase().includes("password")).map((x) => x.description);
    }

    const messages: string[] = [];

    errorDescriptions.forEach((desc) => {
      messages.push(desc);
    });

    const apiErrors: any[] = [{ field: fieldName, messages: messages }];

    handleApiErrors(apiErrors);
  }

  const updatePassword: SubmitHandler<InputTpe> = async (data, event) => {
    event?.preventDefault();

    try {
      console.log("saveUser");
      const response = await changePassword(data.currentPassword, data.newPassword);
      console.log("saveUser response: ", response);

      if (!response.succeeded) throw response;
      else if (response.succeeded) {
        // setHasChanged(false);
        setDisplaySuccess(true);
      }
    } catch (error) {
      console.error("Error: ", error);
      const result = error as IdentityResult;
      const errorCodes = result.errors.map((x) => x.code);

      if (!errorCodes.some((x) => x.includes("PasswordMismatch")) && errorCodes.some((x) => x.toLowerCase().includes("password"))) {
        console.log("newPassword");
        getApiErrors(result, "newPassword");
      }

      if (errorCodes.some((x) => x.includes("PasswordMismatch"))) {
        console.log("currentPassword");
        getApiErrors(result, "currentPassword");
      }
    }
  };

  return (
    <>
      {displaySuccess && <ErrorSuccessAlert isSuccess={true} message="Your password has been changed." />}
      <div className="p-6 mb-0 rounded-t-2xl">
        <h6 className="dark:text-white text-5">Change Password</h6>
      </div>
      <div className="flex-auto p-6 pt-0">
        <form onSubmit={handleSubmit(updatePassword)}>
          <div className="flex flex-col h-full">
            <span className="text-bold pb-1 text-4">Current Password</span>
            <div className="flex pb-6 w-full">
              <div className="relative flex items-center lg:w-4/12 flex-col">
                <div className="flex justify-between items-center w-full">
                  <input
                    {...register("currentPassword")}
                    placeholder="Current Password"
                    type={visible ? "text" : "password"}
                    autoComplete="off"
                    className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
                      errors.currentPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  ></input>
                  <div className="p-2 absolute inset-y-0 right-0 pr-3 items-center cursor-pointer" onClick={() => setVisibility(!visible)}>
                    {visible ? <i className="fa fa-eye" aria-hidden="true"></i> : <i className="fa fa-eye-slash" aria-hidden="true"></i>}
                  </div>
                </div>
                <ErrorMessageComp errors={errors as any} fieldName="currentPassword" />
              </div>
            </div>
            <span className="text-bold  pb-1 text-4">New Password</span>
            <div className="flex  pb-6 w-full">
              <div className="relative flex items-center lg:w-4/12 flex-col">
                <div className="flex justify-between items-center w-full">
                  <input
                    {...register("newPassword")}
                    placeholder="New Password"
                    type={visible ? "text" : "password"}
                    autoComplete="off"
                    className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  ></input>
                  <div className="p-2 absolute inset-y-0 right-0 pr-3 items-center cursor-pointer" onClick={() => setVisibility(!visible)}>
                    {visible ? <i className="fa fa-eye" aria-hidden="true"></i> : <i className="fa fa-eye-slash" aria-hidden="true"></i>}
                  </div>
                </div>
                <ErrorMessageComp errors={errors as any} fieldName="newPassword" />
              </div>
            </div>

            <div className="flex justify-end text-center  pt-6 pb-6 lg:w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block w-full  py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 lg:w-3/12"
              >
                {isSubmitting ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
