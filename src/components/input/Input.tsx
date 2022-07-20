import {
  ChangeEvent,
  FC
} from 'react';

// Styles
import styles from './Input.module.scss';

// Interfaces
interface IInputModel {
  type: string;
  name: string;
  label: string;
  value: string;
  minValue?: string;
  handleOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  showMessage?: boolean;
  message?: string;
  disabled: boolean;
}

const Input:FC<IInputModel> = ({name, label, type, handleOnChange, message, showMessage, minValue, value, disabled}) => {
  return (
    <div className={styles.input_wrapper}>
      <span className={styles.label}>{label}</span>
      <input
        className={showMessage ? styles.color_red : ''}
        name={name}
        type={type}
        value={value}
        min={minValue}
        onChange={e => handleOnChange && handleOnChange(e)}
        disabled={disabled}
      />
      <span className={styles.message}>{showMessage && message}</span>
    </div>
  );
}

export default Input;