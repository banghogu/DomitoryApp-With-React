import { FocusEventHandler, forwardRef, InputHTMLAttributes, useState } from 'react';

import Text from './Text';
import Input from './Input';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hasError?: boolean;
  helpMessage?: React.ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hasError, helpMessage, onFocus, onBlur, ...props }: TextFieldProps, ref) => {
    const [focused, setFocused] = useState(false);

    const labelColor = hasError ? 'red' : focused ? 'blue' : undefined;

    const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
      setFocused(true);
      // ?. 연산자는 앞에 함수가 존재할때만 실행
      onFocus?.(event);
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
      setFocused(false);
      onBlur?.(event);
    };

    return (
      <div>
        {label ? (
          <Text
            typography="t7"
            color={labelColor}
            display="inline-block"
            style={{ marginBottom: 6 }}
          >
            {label}
          </Text>
        ) : null}

        <Input
          ref={ref}
          aria-invalid={hasError}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {helpMessage ? (
          <Text
            typography="t7"
            color={labelColor}
            display="inline-block"
            style={{ marginTop: 6, fontSize: 12 }}
          >
            {helpMessage}
          </Text>
        ) : null}
      </div>
    );
  }
);

export default TextField;
