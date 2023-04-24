import React, { FC } from 'react';
import styles from './CustomInput.module.css';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { IconType } from 'react-icons/lib';
import { useTranslation } from 'react-i18next';

interface AuthInputProps {
  children?: React.ReactNode;
  id: string;
  type: string;
  placeholder: string | null;
  required?: boolean;
  label: string;
  register: UseFormRegister<FieldValues>;
  errors: any;
  autocomplete?: string;
  getValues?: any;
  compareId?: string;
  icon?: IconType;
}

const CustomInput: FC<AuthInputProps> = (props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = React.useState(false);
  const inputEl: any = React.useRef(null);
  const { ref } = props.register(props.id);

  function errorCompareField(id: string): string {
    if (id === 'repeatPwd') {
      return t('validations.pwdnotequals');
    }
    if (id === 'repeatEmail') {
      return t('validations.emailnotequals');
    }
    return '';
  }

  function errorMessage(
    type: string,
    message: string | undefined = undefined
  ): string {
    if (type === 'required') {
      return message ? message : t('validations.required');
    }
    if (type === 'pattern') {
      return message ? message : t('validations.pattern');
    }
    if (type === 'validate') {
      return message ? message : t('validations.notequals');
    }
    return '';
  }

  return (
    <>
      <label className={`${styles.formLabel} form-label`} htmlFor={props.id}>
        {props.label} {props.required && ' *'}
      </label>
      <div
        className={`${styles.inputIconCont} ${
          props.errors && props.errors[props.id]
            ? styles.errorContainer
            : (focused || inputEl.current?.value) && styles.focusedContainer
        }`}
      >
        {props.children && props.children}
        {props.icon && (
          <props.icon
            className={
              props.errors && props.errors[props.id]
                ? styles.errorIcon
                : styles.inputIcon
            }
          />
        )}
        <input
          {...props.register!(props.id, {
            required: props.required,
            validate: props.getValues
              ? (value) =>
                  value === props.getValues(props.compareId) ||
                  errorCompareField(props.id)
              : undefined,
            pattern:
              props.autocomplete === 'email'
                ? {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('validations.invalidemail'),
                  }
                : undefined,
          })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${styles.formInput}`}
          id={props.id}
          name={props.id}
          type={props.type}
          placeholder={props.placeholder ? props.placeholder : ''}
          autoComplete={props.autocomplete ? props.autocomplete : 'off'}
          ref={(e) => {
            ref(e);
            inputEl.current = e;
          }}
        />
      </div>
      {props.errors && props.errors[props.id] && (
        <span className='user-select-none'>
          {errorMessage(
            props.errors[props.id].type,
            props.errors[props.id].message
          )}
        </span>
      )}
    </>
  );
};

export default CustomInput;
