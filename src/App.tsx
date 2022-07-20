import {
  FC,
  useState
} from 'react';

// Styles
import styles from './styles/App.module.scss';

// Hooks
import useGetCountries from './hooks/useGetCountries';

// Components
import Form from './components/form/Form';
import CountriesList from './components/countries-list/CountriesList';

// Interfaces
export interface ICountryObject {
  id: string;
  name: string;
  flagPath: string;
  goldMedals: string;
  silverMedals: string;
  bronzeMedals: string;
  totalNumberOfMedals: string;
}

const App:FC = () => {
  const {countries, dataLoading, error} = useGetCountries();
  const [listOfCountries, setListOfCountries] = useState<ICountryObject[]>([]);

  return (
    <div className={styles.app}>
      <Form
        listOfCountries={listOfCountries}
        setListOfCountries={setListOfCountries}
        countries={countries}
        dataLoading={dataLoading}
        error={error}
      />
      <CountriesList
        listOfCountries={listOfCountries}
        setListOfCountries={setListOfCountries}
      />
    </div>
  );
}

export default App;
