"use client";

import { saveCreateBet } from "@/lib/actions/betInfoAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessageComp from "../auth/ErrorMessage";
import { useState } from "react";

const FormSchema = z
  .object({
    stake: z.string().min(1, "Stake must not be empty!"),
    odds1: z.string().min(1, "Odds must not be empty!"),
    odds2: z.string().min(1, "Odds must not be empty!"),
    betToWin: z.string().min(1, "Bet to Win must not be empty!"),
  })
  .superRefine(({ stake, odds1, odds2, betToWin }, ctx) => {
    let isStakeValid = stake == null || stake == "" ? false : true;
    let isOdds1Valid = odds1 == null || odds1 == "" ? false : true;
    let isOdds2Valid = odds2 == null || odds2 == "" ? false : true;
    let isBetToWinValid = betToWin == null || betToWin == "" ? false : true;
    const storedBalance = typeof window !== "undefined" ? sessionStorage.getItem("userBalance") : null;
    const userBalance = storedBalance ? parseFloat(storedBalance) : 0;

    if (parseInt(stake, 10) < 1) {
      isStakeValid = false;
      ctx.addIssue({
        code: "too_small",
        path: ["stake"],
        minimum: 1,
        inclusive: false,
        type: "string",
        message: `Stake must be greater than 0`,
      });
    } else if (parseInt(stake, 10) > userBalance) {
      isStakeValid = false;
      ctx.addIssue({
        code: "too_small",
        path: ["stake"],
        minimum: 1,
        inclusive: false,
        type: "string",
        message: `Insufficient Balance`,
      });
    }
    if (parseInt(odds1, 10) < 1) {
      isOdds1Valid = false;
      ctx.addIssue({
        code: "too_small",
        path: ["odds1"],
        minimum: 1,
        inclusive: false,
        type: "string",
        message: `Odds must be greater than 0`,
      });
    } else if (parseInt(odds1, 10) > 100) {
      isOdds1Valid = false;
      ctx.addIssue({
        code: "too_big",
        path: ["odds1"],
        maximum: 100,
        inclusive: false,
        type: "string",
        message: `Maximum odds is 100`,
      });
    }
    if (parseInt(odds2, 10) < 1) {
      isOdds2Valid = false;
      ctx.addIssue({
        code: "too_small",
        path: ["odds2"],
        minimum: 1,
        inclusive: false,
        type: "string",
        message: `Odds must be greater than 0`,
      });
    } else if (parseInt(odds2, 10) > 100) {
      isOdds2Valid = false;
      ctx.addIssue({
        code: "too_big",
        path: ["odds2"],
        maximum: 100,
        inclusive: false,
        type: "string",
        message: `Maximum odds is 100`,
      });
    }

    if (isStakeValid && isOdds1Valid && isOdds2Valid && isBetToWinValid) {
      sessionStorage.setItem("modalStatus", "true");
    } else {
      sessionStorage.setItem("modalStatus", "false");
    }
  });

type InputTpe = z.infer<typeof FormSchema>;

interface Props {
  event?: InputTpe;
  displaySuccess: boolean;
  setDisplaySuccess: (displaySuccess: boolean) => void;
}

export default function CreateBetModal(props: Props) {
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

  const resetModal = () => {
    reset();
  };

  const createBet: SubmitHandler<InputTpe> = async (data, event) => {
    event?.preventDefault();

    try {
      let target: Element = event?.target;
      let button = target.querySelector("[id='create-bet-btn']");
      let dataItem = button!.getAttribute("data-item");
      let dataItemParsed = JSON.parse(dataItem!);
      // let eventId = dataItemParsed.Id;
      let eventId = dataItemParsed.id;
      let odds = data.odds1.concat(":", data.odds2);
      let stake = Number(data.stake);
      let winSelection = data.betToWin;

      const fullDataToSubmit = {
        stake,
        odds,
        eventId,
        winSelection,
      };

      const response = await saveCreateBet(fullDataToSubmit);

      // if (response != "Succeeded") throw response;
      // else {
      sessionStorage.setItem("modalStatus", "false");
      sessionStorage.setItem("alert", "true");
      sessionStorage.setItem("userBalance", response.userBalance.toString());
      reset();

      props.setDisplaySuccess(true);
      setTimeout(() => {
        props.setDisplaySuccess(false);
      }, 5000);
      // }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const [inputStakeValue, setInputStakeValue] = useState("");
  const [inputOdds1, setInputOdds1] = useState("1");
  const [inputOdds2, setInputOdds2] = useState("1");

  const allFieldsPopulated = inputStakeValue && inputOdds1 && inputOdds2;
  const oddsInDec = Number(inputOdds1) / Number(inputOdds2) || 0;
  //Est Payout calculation
  const doubledValue = allFieldsPopulated
    ? String(Number(inputStakeValue) + Number(inputStakeValue) * oddsInDec || 0)
    : 0;

  const [selectedTeam, setSelectedTeam] = useState("Choose a team");

  const handleChange = (e: any) => {
    setSelectedTeam(e.target.value);
  };

  return (
    <div
      className="fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto transition-opacity ease-linear opacity-0 z-sticky outline-0"
      id="create-bet-details"
      aria-hidden="true"
    >
      <div className="relative w-auto transition-transform duration-300 pointer-events-none sm:m-7 sm:max-w-100 sm:mx-auto lg:mt-48 ease-soft-out -translate-y-13">
        <div className="relative flex flex-col w-full bg-white border border-solid pointer-events-auto dark:bg-gray-950 bg-clip-padding border-black/20 rounded-xl outline-0">
          <div className="flex items-center justify-between p-4">
            <h5 className="mb-0 leading-normal dark:text-white font-bold" id="ModalLabel">
              Create Bet
            </h5>
            <button
              type="button"
              onClick={resetModal}
              data-target="#create-bet-details"
              // className="create-details-btn
              className="create-details-btn
              fa fa-close w-4 h-4 ml-auto box-content p-2 text-black dark:text-white border-0 rounded-1.5 opacity-50 cursor-pointer -m-2 "
              data-dismiss="modal"
            />
          </div>

          <form onSubmit={handleSubmit(createBet)}>
            <div className="relative flex-auto p-4">
              <div>
                <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  League
                </label>
                <input
                  disabled
                  type="text"
                  name="league"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Game Date & Time
                </label>
                <input
                  disabled
                  type="text"
                  name="dateTime"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Game
                </label>
                <input
                  disabled
                  type="text"
                  name="game"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                />
              </div>
              <div className="flex py-2 mb-1 border-b border-solid border-slate-200"></div>
              <div className="flex flex-col gap-x-4">
                <div className="my-2">
                  <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                    Bet to Win
                  </label>
                  <div className="flex">
                    <select
                      {...register("betToWin")}
                      name="betToWin"
                      value={selectedTeam}
                      onChange={handleChange}
                      className={`p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none w-full text-sm ${
                        errors.betToWin ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Choose a team</option>
                      <option value="" id="team1Dropdown"></option>
                      <option value="" id="team2Dropdown"></option>
                    </select>
                  </div>
                  <ErrorMessageComp errors={errors as any} fieldName="betToWin" />
                </div>
                <div className="flex gap-x-4 justify-between">
                  <div>
                    <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                      Stake
                    </label>
                    <span
                      className={`max-w-40 flex focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none ${
                        errors.stake ? "border-red-500" : "border-gray-300"
                      } `}
                    >
                      £
                      <input
                        {...register("stake")}
                        type="number"
                        name="stake"
                        className="bg-transparent pl-4 max-w-32 focus-visible:outline-none"
                        value={inputStakeValue}
                        onChange={(e) => setInputStakeValue(e.target.value)}
                      />
                    </span>
                    <ErrorMessageComp errors={errors as any} fieldName="stake" />
                  </div>
                  <div>
                    <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                      Odds
                    </label>
                    <span className="flex gap-x-2">
                      <input
                        {...register("odds1")}
                        type="number"
                        name="odds1"
                        // defaultValue="1"
                        value={inputOdds1}
                        className={`max-w-16 focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none ${
                          errors.odds1 ? "border-red-500 text-xs" : "border-gray-300"
                        }`}
                        onChange={(e) => setInputOdds1(e.target.value)}
                      />{" "}
                      <span className="mt-1 text-2xl">/</span>
                      <input
                        {...register("odds2")}
                        type="number"
                        name="odds2"
                        // defaultValue="1"
                        value={inputOdds2}
                        className={`max-w-16 focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none ${
                          errors.odds2 ? "border-red-500" : "border-gray-300"
                        }`}
                        onChange={(e) => setInputOdds2(e.target.value)}
                      />
                    </span>
                    <ErrorMessageComp errors={errors as any} fieldName="odds1" />
                    <ErrorMessageComp errors={errors as any} fieldName="odds2" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex border-solid mx-4">
              <p className="text-xs italic">Your current balance will cover this bet.</p>
            </div>
            <div className="flex py-2 mb-1 border-b border-solid border-slate-200 mx-4"></div>
            <div className="flex flex-col mx-4">
              <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                Your est. payout
              </label>
              <span className="disabled flex focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft max-w-40 appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none">
                £
                <input
                  disabled
                  type="text"
                  name="estpayout"
                  value={doubledValue}
                  className="bg-transparent pl-4 max-w-20"
                />
              </span>
            </div>
            <div className="flex m-4 flex-col text-sm rounded" id="breakdown-container">
              <div className="grid pb-3 text-slate-DEFAULT-950 text-justify">
                <p className="block text-sm">By clicking Create, you agree to terms.</p>
                <p className="text-sm">
                  Furthermore, the stake amount will be deducted from your available balance. Should the bet not be
                  accepted by another user, it will be returned automatically to your balance.
                </p>
              </div>
              <div className="flex place-content-end mb-0 rounded-t-2xl">
                <button
                  id="close-modal-accept"
                  onClick={resetModal}
                  type="button"
                  data-target="#create-bet-details"
                  // data-dismiss="modal"
                  className="
                create-details-btn inline-block px-8 py-3 mt-6 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:scale-102 active:opacity-85 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  id="create-bet-btn"
                  type="submit"
                  // disabled={isSubmitting}
                  data-item=" "
                  className="inline-block px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in-out tracking-tight-soft shadow-soft-md bg-x-25"
                >
                  Create Bet
                  {/* {isSubmitting ? "Updating Account..." : "Create Bet"} */}
                </button>
                {/* <Modal onClose={handleOnClose} visible={showModal} /> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
