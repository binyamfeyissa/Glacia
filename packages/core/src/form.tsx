import {
  forwardRef,
  createContext,
  useContext,
  type FormHTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

interface FormContextValue {
  disabled?: boolean;
}

const FormContext = createContext<FormContextValue>({});

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /** Disables all fields inside the form. */
  disabled?: boolean;
}

export const Form: ForwardRefExoticComponent<
  FormProps & RefAttributes<HTMLFormElement>
> = /* @__PURE__ */ forwardRef<HTMLFormElement, FormProps>(
  function Form({ disabled, className, children, ...props }, ref) {
    return (
      <FormContext.Provider value={{ disabled }}>
        <form
          ref={ref}
          className={cx("gl-form", className)}
          aria-disabled={disabled}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

export function useFormContext() {
  return useContext(FormContext);
}
