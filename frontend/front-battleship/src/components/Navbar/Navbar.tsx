import { FC } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { MdLogout } from 'react-icons/md';
import { ImUser } from 'react-icons/im';
import {
  PATH_RANKING,
  PATH_HOME,
  PATH_GAME_MODE,
  PATH_MY_GAMES,
} from '../../utils/Routes';
import { signOut, selectUserData } from '../../store/slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import spanish from '../../assets/spanish.png';
import english from '../../assets/english.png';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const signout = () => {
    dispatch(signOut());
  };
  const user = useAppSelector(selectUserData);
  

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav
      className={`d-flex w-100 ${styles.Navbar} px-3 navbar navbar-expand-lg navbar-light text-capitalize`}
    >
      <div className='navbar-brand collapse navbar-collapse justify-content-start'>
        <Link to={PATH_HOME}>
          <span className={`${styles.title}`}>battleship</span>
          <img className={`${styles.logo}`} src={logo} alt='Logo Battleship' />
        </Link>
      </div>
      <div className='collapse navbar-collapse justify-content-center'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <span className='nav-link mx-3'>
              <Link to={PATH_MY_GAMES} className='linkStyle'>
              {t('navbar.myGames')}
              </Link>
            </span>
          </li>
          <li className='nav-item'>
            <span className='nav-link mx-3'>
              <Link to={PATH_GAME_MODE} className='linkStyle'>
              {t('navbar.play')}
              </Link>
            </span>
          </li>
          <li className='nav-item'>
            <span className='nav-link mx-3'>
              <Link to={PATH_RANKING} className='linkStyle'>
              {t('navbar.ranking')}
              </Link>
            </span>
          </li>
        </ul>
      </div>
      <div className='collapse navbar-collapse justify-content-end'>
        <ul className='navbar-nav'>
          {user && (
            <li
              className={`nav-item d-flex justify-content-center align-items-center me-2 ${styles.Name}`}
            >{`${user.name}`}</li>
          )}
          <li className={`nav-item ${styles.languages} mx-2`}>
            <img alt={t('language.altes')!} width={20} className='lngButton' src={spanish} onClick={() => changeLanguageHandler('es')}/>
            <img alt={t('language.alten')!} width={20} className='lngButton' src={english} onClick={() => changeLanguageHandler('en')}/>
          </li>
          <li className='nav-item'>
            <span className='nav-link' role='button'>
              <ImUser />
            </span>
          </li>
          <li className='nav-item ms-2'>
            <span onClick={signout} className='nav-link' role='button'>
              <MdLogout />
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
