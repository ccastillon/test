import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors } from "react-hook-form";
import _, { prop } from "lodash/fp";

interface Props {
  errors: FieldErrors;
  fieldName: string;
}

export default function ErrorMessageComp({ ...props }: Props) {
  return (
    <ErrorMessage
      errors={props.errors}
      name={props.fieldName}
      render={({ messages }) => {
        if (messages != undefined) {
          const too_small_errors = messages.too_small;
          if (too_small_errors !== undefined && Array.isArray(too_small_errors)) {
            const firstError = (too_small_errors as string[])[0];
            messages = { too_small: firstError };
          } else if (props.fieldName === "email" && typeof too_small_errors === "string") {
            if (too_small_errors !== undefined) {
              messages = { too_small: too_small_errors };
            }
          }
        }

        return messages
          ? _.entries(messages).map(([type, message]: [string, any]) => {
              if (type === "custom" && props.fieldName === "password") {
                return (
                  <div key={type} className="flex flex-col text-start text-red-500 text-sm">
                    <span>Your password must have:</span>
                    <ul className="list-disc pl-5">
                      <li>8 or more characters</li>
                      <li>Upper & lowercase letters</li>
                      <li>At least one number</li>
                      <li>At least one special character: ! @ # $.</li>
                    </ul>
                  </div>
                );
              } else if (type.includes("apiError")) {
                return (
                  <span className="text-start text-red-500 block text-sm" key={type}>
                    {message}
                  </span>
                );
              } else {
                return (
                  <span className="text-start block text-red-500 text-sm" key={type}>
                    {message}
                  </span>
                );
              }
            })
          : null;
      }}
    />
  );
}
