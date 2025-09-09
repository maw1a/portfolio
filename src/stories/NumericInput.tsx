import {
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type FC,
  type FocusEventHandler,
  type KeyboardEventHandler,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type WheelEventHandler,
} from "react";
import { cn } from "@/utils/helpers/cn";

const padWithZeros = (value: string, minLength: number) => {
  if (value === "-") return value;
  const isNegative = value.startsWith("-");
  let numPart = isNegative ? value.slice(1) : value;
  numPart = numPart.padStart(minLength, "0");
  return isNegative ? `-${numPart}` : numPart;
};

const truncateToMaxLength = (value: string, maxLength: number) => {
  if (value === "-") return value;
  const isNegative = value.startsWith("-");
  let numPart = isNegative ? value.slice(1) : value;
  if (numPart.length > maxLength) numPart = numPart.slice(0, maxLength);
  return isNegative ? `-${numPart}` : numPart;
};

const sanitizeValue = (value: string) => {
  if (value === "-") return value;
  value = value.replace(/[^0-9-]/g, "");
  if (value.startsWith("-")) {
    value = `-${value.slice(1).replace(/-/g, "")}`;
  } else {
    value = value.replace(/-/g, "");
  }
  return value;
};

const clamp = (value: number, min?: number, max?: number) => {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
};

const processValue = (
  rawValue: string,
  minLength: number,
  maxLength: number,
  min?: number,
  max?: number,
) => {
  let value = sanitizeValue(rawValue);

  // Clamp to min/max if not just "-"
  if (value !== "-") {
    const n = Number(value);
    if (!Number.isNaN(n)) {
      const clamped = clamp(n, min, max);
      value = String(clamped);
    }
  }

  // Truncate numeric part to maxLength
  if (maxLength !== undefined && maxLength !== Infinity && value !== "-")
    value = truncateToMaxLength(value, maxLength);

  // Pad with zeros if minLength is set and not just "-"
  if (minLength > 0 && value !== "-") value = padWithZeros(value, minLength);

  return value;
};

const getNumber = (value: string): number | null => {
  if (value === "" || value === "-") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

export const NumInput: FC<ComponentPropsWithRef<"input">> = ({
  ref,
  className,
  min,
  max,
  minLength = 0,
  maxLength = Infinity,
  onChange,
  onBlur,
  onFocus,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null!);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => inputRef.current);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeValue(e.target.value);
      if (max !== undefined && Number(value) > Number(max)) return;
      if (min !== undefined && Number(value) < Number(min)) return;

      if (inputRef.current) inputRef.current.value = value;

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    },
    [onChange, max, min],
  );

  const onBlurHandler: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setIsFocused(false);
      const processedValue = processValue(
        e.target.value,
        minLength,
        maxLength,
        Number(min),
        Number(max),
      );

      if (inputRef.current) inputRef.current.value = processedValue;

      if (onBlur) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: processedValue },
        } as React.FocusEvent<HTMLInputElement>;
        onBlur(syntheticEvent);
      }
    },
    [onBlur, minLength, maxLength, min, max],
  );

  const onFocusHandler: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

      if (!inputRef.current) return;
      const currentValue = inputRef.current.value;
      const n = getNumber(currentValue);

      // If empty or just "-", treat as 0 or -0
      let newValue: string;
      if (n === null) {
        newValue = e.key === "ArrowDown" ? "-1" : "1";
      } else {
        const next = e.key === "ArrowDown" ? n - 1 : n + 1;
        newValue = String(next);
      }

      // Apply length limits on blur, but keep sanitized for now
      newValue = sanitizeValue(newValue);

      inputRef.current.value = newValue;

      e.preventDefault();
    },
    [],
  );

  const onWheelHandler: WheelEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (!isFocused) return;
      if (!inputRef.current) return;
      const currentValue = inputRef.current.value;
      const n = getNumber(currentValue);

      let newValue: string;
      if (n === null) {
        newValue = e.deltaY > 0 ? "-1" : "1";
      } else {
        const next = e.deltaY > 0 ? n - 1 : n + 1;
        newValue = String(next);
      }

      newValue = sanitizeValue(newValue);

      inputRef.current.value = newValue;
    },
    [isFocused],
  );

  return (
    <input
      {...props}
      className={cn(className, "overflow-clip overscroll-none")}
      ref={inputRef}
      minLength={minLength}
      maxLength={maxLength}
      type="text"
      inputMode="numeric"
      pattern="-?[0-9]*"
      onChange={onChangeHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      onKeyDown={onKeyDownHandler}
      onWheel={onWheelHandler}
    />
  );
};
