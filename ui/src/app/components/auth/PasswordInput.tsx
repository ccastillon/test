"use client";
import React, { useState } from "react";

export const PasswordInput = (props: any) => {
  const [password, setPassword] = useState("");
  const [visible, setVisibility] = useState(false);

  return (
    <div className="flex justify-between items-center w-full">
      <input
        required
        value={password}
        placeholder={props.data}
        id="password"
        name="password"
        type={visible ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="off"
        className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
      ></input>
      <div className="p-2 absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setVisibility(!visible)}>
        {visible ? <i className="fa fa-eye" aria-hidden="true"></i> : <i className="fa fa-eye-slash" aria-hidden="true"></i>}
      </div>
    </div>
  );
};
