"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveEditUser } from "@/lib/actions/accountInfoActions";
import { IdentityResult } from "user-module";
import { diff_years } from "@/lib/dateComparison";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import ErrorMessageComp from "../auth/ErrorMessage";
import ErrorSuccessAlert from "../ErrorSuccessAlert";

const FormSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "What's your name?").min(2, "Name must be at least 2 characters.").max(50, "Name must be less than 50 characters."),
    username: z
      .string()
      .min(1, "Username is required.")
      .min(6, "Your username must be at least 6 characters.")
      .max(30, "Your username must be less than 30 characters.")
      .regex(new RegExp("^[a-zA-Z0-9]+$"), "Sorry, only letters (a-z) and numbers (0-9) are allowed."),
    email: z.string().min(1, "Email address is required.").email("Please enter a valid email address."),
    dateOfBirth: z.coerce.date({
      required_error: "Your birthday is required.",
      invalid_type_error: "Please enter a valid date.",
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
  });

type InputTpe = z.infer<typeof FormSchema>;

interface EditUserFormProps {
  // Explicitly type the user prop
  user?: InputTpe;
}

interface ApiErrorProps {
  field: string;
  messages: any[];
}

export default function EditAccountInfoForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const dateTimePicker = { datetimepicker: "" };
  const [showModal, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  let dateOfBirthStr = "";
  if (user !== undefined) {
    const date = new Date(user.dateOfBirth.toString());
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    let monthStr = month < 10 ? "0" + month : month;

    dateOfBirthStr = year + "-" + monthStr + "-" + day;
  }

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
    defaultValues: {
      id: user?.id,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      // dateOfBirth: new Date(dateOfBirthStr),
    },
  });

  function handleOnChange() {
    setHasChanged(true);
  }

  function handleButtonClick() {
    if (hasChanged) {
      setShowModal(true);
    } else {
      // route back to account info
      router.push("/account/info");
    }
  }

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
      console.log("saveUser");
      const response = await saveEditUser(data);
      console.log("saveUser response: ", response);

      if (!response.succeeded) throw response;
      else if (response.succeeded) {
        setHasChanged(false);
        setDisplaySuccess(true);
      }
    } catch (error) {
      console.error("Error: ", error);
      const result = error as IdentityResult;
      const errorCodes = result.errors.map((x) => x.code);

      if (errorCodes.some((x) => x.toLowerCase().includes("username"))) {
        getApiErrors(result, "username");
      }

      if (errorCodes.some((x) => x.toLowerCase().includes("email"))) {
        getApiErrors(result, "email");
      }
    }
  };

  return (
    <>
      {displaySuccess && <ErrorSuccessAlert isSuccess={true} message="Your account information has been updated." />}
      <div className="flex justify-between p-6 mb-0 rounded-t-2xl">
        <h5 className="inline-block mt-2 dark:text-white font-bold">
          <button onClick={handleButtonClick} type="button" className="mr-3 hover:text-gray-600">
            <i className="fa fa-arrow-left " aria-hidden="true"></i>
          </button>
          Edit Account Info
        </h5>
      </div>
      <div className="flex-auto p-6 pt-0">
        {user == undefined ? (
          <div className="grid grid-cols-4 gap-y-4">
            <p>Failed to fetch user data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(saveUser)} onChange={handleOnChange}>
            <div className="w-4/12 max-w-full flex-0">
              <input {...register("id")} type="hidden" />
              <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                Name
              </label>
              <div className="block w-full flex-col h-full relative flex-wrap items-stretch rounded-lg">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Name"
                  className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessageComp errors={errors as any} fieldName="name" />
              </div>
              <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Username">
                Username
              </label>
              <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
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
              <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Email">
                Email Address
              </label>
              <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
                <input
                  disabled
                  {...register("email")}
                  placeholder="Email"
                  className={`focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessageComp errors={errors as any} fieldName="email" />
              </div>
            </div>
            <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Date">
              Date of Birth
            </label>
            <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
              <input
                {...register("dateOfBirth")}
                {...dateTimePicker}
                className={`w-2/12 focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block appearance-none rounded-lg border border-solid bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-non ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
                type="date"
                placeholder="Date of birth"
                value={dateOfBirthStr}
              />
              <ErrorMessageComp errors={errors as any} fieldName="dateOfBirth" />
            </div>

            <div className="flex place-content-end p-6 mb-0 rounded-t-2xl">
              <button
                onClick={handleButtonClick}
                type="button"
                className="inline-block px-8 py-3 mt-6 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:scale-102 active:opacity-85 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in-out tracking-tight-soft shadow-soft-md bg-x-25"
              >
                {isSubmitting ? "Updating Account..." : "Update Account"}
              </button>
              <Modal onClose={handleOnClose} visible={showModal} />
            </div>
          </form>
        )}
      </div>
    </>
  );
}
