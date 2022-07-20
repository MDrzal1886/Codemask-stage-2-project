import {
  useEffect,
  useState
} from 'react';

interface ICountryData {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  cca2: string;
}

export interface ICountry {
  id: string;
  name: string;
  flagPath: string
}

const useGetCountries = () => {
  const [countries, setCountries] = useState<ICountry[]>();
  const [error, setError] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await fetch('https://restcountries.com/v3.1/all');
        const featchedCountries: ICountryData[] = await data.json();

        if (data.status !== 200) {
          throw new Error();
        };

        setCountries(featchedCountries.map((country: ICountryData) => {
          return {
            id: country.cca2,
            name: country.name.common,
            flagPath: country.flags.png
          }
        }));

        setDataLoading(false);
      } catch (err) {
        setDataLoading(false);
        setError(true);
      }
    }

    fetchCountries();
  }, []);
  
  return {
    countries,
    error,
    dataLoading
  };
}

export default useGetCountries;