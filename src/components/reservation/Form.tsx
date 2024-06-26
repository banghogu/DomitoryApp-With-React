/* eslint-disable no-unused-vars */
import { Hotel, ReservationForm } from '@/model/hotel';
import { useForm } from 'react-hook-form';
import Text from '../shared/Text';
import { Fragment, useCallback } from 'react';
import TextField from '../shared/TextField';
import Select from '../shared/Select';
import Spacing from '../shared/Spacing';
import FixedBottomButton from '../shared/FixedBottomButton';

interface FormData {
  [key: string]: string;
}

const Form = ({
  forms,
  onSubmit,
  buttonLabel,
}: {
  forms: Hotel['forms'];
  onSubmit: (formvalues: FormData) => void;
  buttonLabel: string;
}) => {
  const { register, formState, handleSubmit } = useForm({
    mode: 'onBlur',
  });

  const component = useCallback(
    (form: ReservationForm) => {
      if (form.type === 'TEXT_FIELD') {
        return (
          <>
            <TextField
              label={form.label}
              helpMessage={(formState.errors[form.id]?.message as string) || form.helpMessage}
              hasError={formState.errors[form.id] != null}
              {...register(form.id, {
                required: form.required,
                pattern: VALIDATION_MESSAGE_MAP[form.id],
              })}
            />
            <Spacing size={16} />
          </>
        );
      } else if (form.type === 'SELECT') {
        return (
          <>
            <Select
              label={form.label}
              // hasError={formState.errors[form.id] != null}
              options={form.options}
              {...register(form.id, {
                required: form.required,
                pattern: VALIDATION_MESSAGE_MAP[form.id],
              })}
            />
            <Spacing size={16} />
          </>
        );
      } else {
        return null;
      }
    },
    [register, formState.errors]
  );
  return (
    <div style={{ padding: 24 }}>
      <Text bold={true}>예약정보</Text>
      <Spacing size={16} />
      <form>
        {forms.map((form) => {
          return <Fragment key={form.id}>{component(form)}</Fragment>;
        })}
      </form>
      <Spacing size={80} />

      <FixedBottomButton label={buttonLabel} onClick={handleSubmit(onSubmit)} />
    </div>
  );
};

const VALIDATION_MESSAGE_MAP: {
  [key: string]: {
    value: RegExp;
    message: string;
  };
} = {
  name: {
    value: /^[가-힣]+$/,
    message: '한글명을 확인해주세요',
  },
  email: {
    value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    message: '이메일 형식을 확인해주세요',
  },
  phone: {
    value: /^\d+$/,
    message: '휴대전화번호를 확인해주세요',
  },
};

export default Form;
