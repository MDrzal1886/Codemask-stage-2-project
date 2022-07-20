import {
  FC,
  Dispatch,
  useEffect,
  useState,
  Fragment
} from 'react';

// Assets
import {ReactComponent as EditSvg} from '../../assets/edit.svg';
import {ReactComponent as CloseSvg} from '../../assets/clear.svg';
import {ReactComponent as DeleteSvg} from '../../assets/delete.svg';

// Styles
import styles from './CountriesList.module.scss';

// Components
import Form from '../form/Form';
import Button from '../button/Button';

// Interfaces
import {ICountryObject} from '../../App';

interface ICountriesListModel {
  listOfCountries: ICountryObject[];
  setListOfCountries: Dispatch<React.SetStateAction<ICountryObject[]>>;
}

const CountriesList:FC<ICountriesListModel> = ({listOfCountries, setListOfCountries}) => {
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const [selectValue, setSelectValue] = useState('Total');
  const [sortList, setSortList] = useState(listOfCountries);
  const [showEditModal, setShowEditModal] = useState('');

  const handleDelete = (id?: string) => {
    const editList = listOfCountries.filter(country => country.id !== (showEditModal === '' ? id : showEditModal));
    setListOfCountries(editList);
    setShowEditModal('');
  }

  useEffect(() => {
    let newSortList = [...listOfCountries];
    switch (selectValue) {
      case 'Total':
        newSortList.sort((a, b) => {
          if (Number(a.totalNumberOfMedals) > Number(b.totalNumberOfMedals)) {
            return -1;
          }
          if (Number(a.totalNumberOfMedals) < Number(b.totalNumberOfMedals)) {
            return 1;
          }
          return 0;
        });
        break;

        case 'Gold':
        newSortList.sort((a, b) => {
          if (Number(a.goldMedals) > Number(b.goldMedals)) {
            return -1;
          }
          if (Number(a.goldMedals) < Number(b.goldMedals)) {
            return 1;
          }
          return 0;
        });
        break;

        case 'Silver':
        newSortList.sort((a, b) => {
          if (Number(a.silverMedals) > Number(b.silverMedals)) {
            return -1;
          }
          if (Number(a.silverMedals) < Number(b.silverMedals)) {
            return 1;
          }
          return 0;
        });
        break;

        case 'Bronze':
        newSortList.sort((a, b) => {
          if (Number(a.bronzeMedals) > Number(b.bronzeMedals)) {
            return -1;
          }
          if (Number(a.bronzeMedals) < Number(b.bronzeMedals)) {
            return 1;
          }
          return 0;
        });
        break;

      case 'Name':
        if (screenWidth > 750) {
          newSortList.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        } else {
          newSortList.sort((a, b) => {
            if (a.id < b.id) {
              return -1;
            }
            if (a.id > b.id) {
              return 1;
            }
            return 0;
          });
        }
        break;

      default:
        break;
    }

    setSortList(newSortList);
  }, [listOfCountries, selectValue, screenWidth]);

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));

    return () => {
      window.removeEventListener('resize', () => setScreenWidth(window.innerWidth));
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      {sortList.length > 0 &&
        <Fragment>
          <div className={styles.select_wrapper}>
          <select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option>Total</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Bronze</option>
            <option>Name</option>
          </select>
          </div>
          <div className={styles.list_wrapper}>
            <div className={styles.list_header}>
              <div className={styles.name}>NAME</div>
              <div className={styles.medals_number}>{screenWidth > 750 ? 'GOLD' : 'G'}</div>
              <div className={styles.medals_number}>{screenWidth > 750 ? 'SILVER' : 'S'}</div>
              <div className={styles.medals_number}>{screenWidth > 750 ? 'BRONZE' : 'B'}</div>
              <div className={styles.medals_number}>TOTAL</div>
            </div>
            {sortList.map(country => (
              <div
                className={styles.single_element}
                key={country.id}
              >
                <div className={styles.name}>
                  <img src={country.flagPath} alt={country.id} />
                  {screenWidth > 750 ? country.name : country.id}
                </div>
                <div className={styles.medals_number}>{country.goldMedals}</div>
                <div className={styles.medals_number}>{country.silverMedals}</div>
                <div className={styles.medals_number}>{country.bronzeMedals}</div>
                <div className={styles.medals_number}>{country.totalNumberOfMedals}</div>
                <div className={styles.options_wrapper}>
                  <div
                    className={styles.edit}
                    onClick={() => setShowEditModal(country.id)}
                  >
                    <EditSvg />
                  </div>
                  {screenWidth > 750 &&
                    <div
                      className={styles.delete}
                      onClick={() => handleDelete(country.id)}
                    >
                      <DeleteSvg />
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
          {showEditModal !== '' &&
            <div className={styles.edit_modal}>
              <div className={styles.modal_content}>
                <div
                  className={styles.close_button}
                  onClick={() => setShowEditModal('')}
                >
                  <CloseSvg />
                </div>
                <Form
                  listOfCountries={listOfCountries}
                  setListOfCountries={setListOfCountries}
                  editCountryObject={listOfCountries.find(country => country.id === showEditModal)}
                  handleModalClose={setShowEditModal}
                />
                {screenWidth < 750 &&
                  <div className={styles.button_wrapper}>
                    <Button
                      name="Delete"
                      handleOnClick={handleDelete}
                    />
                  </div>
                }
              </div>
            </div>
          }
        </Fragment>
      }
    </div>
  );
}

export default CountriesList;