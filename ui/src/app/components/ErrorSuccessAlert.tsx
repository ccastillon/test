import { IconContext } from "react-icons";
import { FaCircleCheck } from "react-icons/fa6";

interface Props {
  isSuccess: boolean;
  message: string | JSX.Element;
}

export default function ErrorSuccessAlert({ isSuccess, message }: Props) {
  const errorAlertAtr = { alert: "" };

  if (isSuccess) {
    return (
      <div
        {...errorAlertAtr}
        className="relative p-4 pr-12 mt-4 mx-6 text-black border border-solid rounded-lg border-green-100 bg-green-100"
      >
        <IconContext.Provider value={{ color: "#16a34a", size: "1.5em" }}>
          <span>
            <FaCircleCheck />
          </span>
        </IconContext.Provider>
        &nbsp; &nbsp; <span className="font-bold">Success! </span> &nbsp;{" "}
        {message}
        <button
          type="button"
          alert-close=""
          className="box-content absolute top-0 right-0 p-4 text-black bg-transparent border-0 rounded w-4 h-4 text-sm z-2"
        >
          <span aria-hidden="true" className="text-center cursor-pointer">
            ✕
          </span>
        </button>
      </div>
    );
  } else {
    return null;
  }
}
