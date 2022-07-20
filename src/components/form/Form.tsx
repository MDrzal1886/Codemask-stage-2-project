import {
  Dispatch,
  ChangeEvent,
  FC,
  FormEvent,
  useState,
  useEffect,
  useLayoutEffect
} from 'react';

// Styles
import styles from './Form.module.scss';

// Components
import FilterDropdown from '../filter-dropdown/FilterDropdown';
import Input from '../input/Input';
import Button from '../button/Button';

//Interfaces
import {ICountry} from '../../hooks/useGetCountries';
import {ICountryObject} from '../../App';

interface IFormModel {
  countries?: ICountry[];
  dataLoading?: boolean;
  error?: boolean;
  listOfCountries: ICountryObject[];
  setListOfCountries: Dispatch<React.SetStateAction<ICountryObject[]>>;
  editCountryObject?: ICountryObject;
  handleModalClose?:  Dispatch<React.SetStateAction<string>>;
}

const Form:FC<IFormModel> = ({listOfCountries, setListOfCountries, editCountryObject, handleModalClose, countries, dataLoading, error}) => {
  const [optionsToShow, setOptionsToShow] = useState<ICountry[]>();
  const [showMessage, setShowMessage] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [countryObject, setCountryObject] = useState({
    id: '',
    name: '',
    flagPath: '',
    goldMedals: '',
    silverMedals: '',
    bronzeMedals: '',
    totalNumberOfMedals: ''
  });
  const [isFormValidate, setIsFormValidate] = useState(false);

  const handlePick = (country: ICountry) => {
    setInputValue(country.name);
    setCountryObject({
      ...countryObject,
      id: country.id,
      name: country.name,
      flagPath: country.flagPath
    });
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.length > 1 && e.target.value[0] === '0' ? e.target.value.substring(1) : e.target.value;
    let total;
    switch (e.target.name) {
      case 'goldMedals':
        total = (Number(value) + Number(countryObject.silverMedals) + Number(countryObject.bronzeMedals)).toString();
        break;

      case 'silverMedals':
        total = (Number(countryObject.goldMedals) + Number(value) + Number(countryObject.bronzeMedals)).toString();
        break;

      case 'bronzeMedals':
        total = (Number(countryObject.goldMedals) + Number(countryObject.silverMedals) + Number(value)).toString();
        break;
    
      default:
        total = '0';
        break;
    };
    setCountryObject({
      ...countryObject,
      [e.target.name]: value,
      totalNumberOfMedals: total
    });
  }

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!isFormValidate) {
      setShowMessage(true);
    } else {
      const editCountry = listOfCountries.find(country => country.id === countryObject.id);
      if (editCountry) {
        const editList = listOfCountries.map(country => {
          if (country.id === editCountry.id) {
            return countryObject;
          } else {
            return country;
          }
        });
        setListOfCountries(editList);
        handleModalClose && handleModalClose('');
      } else {
        setListOfCountries([...listOfCountries, countryObject]);
      }

      setInputValue('');
      setCountryObject({
        id: '',
        name: '',
        flagPath: '',
        goldMedals: '',
        silverMedals: '',
        bronzeMedals: '',
        totalNumberOfMedals: ''
      });
      setShowMessage(false);
    }
  }

  useLayoutEffect(() => {
    if (editCountryObject) {
      setIsFormValidate(true);
      setInputValue(editCountryObject.name);
      setCountryObject(editCountryObject);
    }
  }, [editCountryObject]);

  useEffect(() => {
    if (editCountryObject) {
      setIsFormValidate(!(countryObject.goldMedals === '' ||
        countryObject.silverMedals === '' ||
        countryObject.bronzeMedals === ''
      ));
    } else {
      setIsFormValidate(!(!countries?.find(country => country.name === countryObject.name) ||
        countryObject.goldMedals === '' ||
        countryObject.silverMedals === '' ||
        countryObject.bronzeMedals === ''
      ));
    }
  }, [countryObject, editCountryObject, countries]);

  useEffect(() => {
    const optionsToShow = countries?.filter(country => !listOfCountries.find(chosenCountry => country.name === chosenCountry.name));
    optionsToShow?.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setOptionsToShow(optionsToShow);
  }, [countries, listOfCountries]);

  useEffect(() => {
    if (countryObject.name !== '' && inputValue !== countryObject.name) {
      setCountryObject({
        ...countryObject,
        name: ''
      });
    }
  }, [inputValue, countryObject]);

  return (
    <form
      className={styles.form}
      onSubmit={e => handleOnSubmit(e)}
      noValidate
    >
      <div className={styles.column}>
        <div className={styles.dropdown_wrapper}>
          {editCountryObject ?
            <p className={styles.edit_country_name}>
              {editCountryObject.name}
            </p>
            :
            <FilterDropdown
              countries={optionsToShow}
              dataLoading={!!dataLoading}
              error={!!error}
              label="Country"
              placeholder="Pick country"
              showMessage={showMessage && !countries?.find(country => country.name === countryObject.name)}
              message="Pick country from list"
              inputValue={inputValue}
              setInputValue={setInputValue}
              handlePick={handlePick}
            />
          }
        </div>
        <div className={styles.input_wrapper}>
          <Input
            type="number"
            name="goldMedals"
            label="Gold medals"
            minValue="0"
            value={countryObject.goldMedals}
            handleOnChange={handleOnChange}
            message="Enter number"
            showMessage={showMessage && countryObject.goldMedals === ''}
            disabled={false}
          />
        </div>
        <div className={styles.input_wrapper}>
          <Input
            type="number"
            name="silverMedals"
            label="Silver medals"
            minValue="0"
            value={countryObject.silverMedals}
            handleOnChange={handleOnChange}
            message="Enter number"
            showMessage={showMessage && countryObject.silverMedals === ''}
            disabled={false}
          />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.input_wrapper}>
          <Input
            type="number"
            name="bronzeMedals"
            label="Bronze medals"
            minValue="0"
            value={countryObject.bronzeMedals}
            handleOnChange={handleOnChange}
            message="Enter number"
            showMessage={showMessage && countryObject.bronzeMedals === ''}
            disabled={false}
          />
        </div>
        <div className={styles.input_wrapper}>
          <Input
            type="number"
            name="totalNumberOfMedals"
            label="Total number of medals"
            value={countryObject.totalNumberOfMedals}
            disabled={true}
          />
        </div>
        <div className={styles.button_wrapper}>
          <Button
            name={editCountryObject ? 'Edit' : 'Add'}
            isFormValidate={isFormValidate}
          />
        </div>
      </div>
    </form>
  );
}

export default Form;