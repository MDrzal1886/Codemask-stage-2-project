import {FC} from 'react';

// Styles
import styles from './Spinner.module.scss';

const Spinner:FC = () => {
  return (
    <div className={styles.spinner}/>
  );
}

export default Spinner;