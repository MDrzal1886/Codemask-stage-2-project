import {FC} from 'react';

// Styles
import styles from './Button.module.scss';

// Interfaces
interface IButtonModel {
  name: string;
  isFormValidate?: boolean;
  handleOnClick?: () => void;
}

const Button:FC<IButtonModel> = ({isFormValidate, name, handleOnClick}) => {
  const buttonClass = `${styles.button} ${isFormValidate ?
    styles.validate
    :
    handleOnClick ?
      styles.delete
      :
      styles.no_validate
  }`;
  
  return (
    <button
      className={buttonClass}
      onClick={handleOnClick && handleOnClick}
    >
      {name.toUpperCase()}
    </button>
  );
}

export default Button;