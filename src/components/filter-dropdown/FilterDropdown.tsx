import {
  Dispatch,
  FC,
  useEffect,
  useState,
  useRef
} from 'react';

// Assets
import {ReactComponent as ArrowSvg} from '../../assets/arrow.svg';
import {ReactComponent as ClearSvg} from '../../assets/clear.svg';

// Styles
import styles from './FilterDropdown.module.scss';

// Hooks
import useOutsideClick from '../../hooks/useOutsideClick';

// Components
import Spinner from '../spinner/Spinner';

//Interfaces
import {ICountry} from '../../hooks/useGetCountries';

interface IFilterDropdownModel {
  countries?: ICountry[];
  dataLoading: boolean;
  error: boolean;
  label: string;
  placeholder: string;
  inputValue: string;
  setInputValue: Dispatch<React.SetStateAction<string>>;
  handlePick: (country: ICountry) => void;
  showMessage: boolean;
  message: string;
}

const FilterDropdown:FC<IFilterDropdownModel> = ({countries, dataLoading, error, label, placeholder, handlePick, message, showMessage, inputValue, setInputValue}) => {
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<ICountry[] | undefined>(countries);
  const [dropdownShow, setDropdownShow] = useState(false);
  
  useOutsideClick(wrapperRef, setDropdownShow);

  const handleSingleOptionClick = (option: ICountry) => {
    handlePick(option);
    setDropdownShow(false);
  }

  const handleClear = () => {
    setInputValue('');
    setDropdownShow(true);
    inputRef.current?.focus();
  }

  const handleArrowClick = () => {
    if (dropdownShow) {
      setDropdownShow(false);
    } else {
      setDropdownShow(true);
      inputRef.current?.focus();
    }
  }

  useEffect(() => {
    if (countries) {
      const filteredOptions = countries?.filter(option => option.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()));
      setOptions(filteredOptions);
    }
  }, [inputValue, countries]);

  useEffect(() => {
    const ref = inputRef;
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', () => setDropdownShow(true));
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('focus', () => setDropdownShow(false));
      }
    }
  }, [inputRef]);

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
    >
      <div className={styles.dropdown_wrapper}>
        <span className={styles.label}>{label}</span>
        <div className={`${styles.input_wrapper} ${showMessage ? styles.color_red : ''}`}>
          <input
            type="text"
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          {inputValue.length > 0 &&
            <div
              className={styles.clear_wrapper}
              onClick={handleClear}
            >
              <ClearSvg />
            </div>
          }
          <div
            className={`${styles.arrow_wrapper} ${dropdownShow ? styles.rotate_arrow : ''}`}
            onClick={handleArrowClick}
          >
            <ArrowSvg />
          </div>
        </div>
        <span className={styles.message}>{showMessage && message}</span>
      </div>
      {dropdownShow &&
        <div className={styles.options_wrapper}>
          {dataLoading ?
            <div className={styles.spinner_wrapper}>
              <Spinner />
            </div>
            :
            error ?
              <p className={styles.error_wrapper}>Sorry, something went wrong</p>
              :
              options && options.length > 0 ?
                options?.map(option => (
                  <div
                    className={styles.single_option}
                    key={option.id}
                    onClick={() => handleSingleOptionClick(option)}
                  >
                    {option.name}
                  </div>
                ))
                :
                <p
                  className={styles.error_wrapper}
                  dangerouslySetInnerHTML={{__html: `Nothing fit for <strong>${inputValue}</strong>`}}
                />
          }
        </div>
      }
    </div>
  );
}

export default FilterDropdown;