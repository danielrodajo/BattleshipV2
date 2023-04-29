import { FC } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { MdLogout } from 'react-icons/md';
import { ImUser } from 'react-icons/im';
import { GiLaurelsTrophy } from 'react-icons/gi';
import {
  PATH_RANKING,
  PATH_HOME,
  PATH_GAME_MODE,
  PATH_MY_GAMES,
} from '../../Routes';
import { signOut, selectUserData } from '../../store/slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import spanish from '../../assets/spanish.png';
import english from '../../assets/english.png';
import useLanguageHandler from '../../hooks/useLanguageHandler';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { changeLanguage } = useLanguageHandler();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const signout = () => {
    dispatch(signOut());
  };
  const user = useAppSelector(selectUserData);

  const background = {
    backgroundColor: 'rgb(240, 243, 250)',
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light px-3 text-capitalize ${styles.Navbar}`}
    >
      <Link to={PATH_HOME}>
        <span className={`${styles.title}`}>battleship</span>
        <img className={`${styles.logo}`} src={logo} alt='Logo Battleship' />
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className={styles.NavbarGrid}>
        <div
          style={background}
          className='collapse navbar-collapse justify-content-start'
          id='navbarSupportedContent'
        ></div>
        <div
          style={background}
          className='collapse navbar-collapse justify-content-center'
          id='navbarSupportedContent'
        >
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
          <hr />
        </div>
        <div
          style={background}
          className='collapse navbar-collapse justify-content-end'
          id='navbarSupportedContent'
        >
          <ul className='navbar-nav'>
            {user && (
              <>
                <li
                  className={`d-flex align-items-center nav-item me-2 ${styles.Name}`}
                >
                  <span className={`me-2 ${styles.Name}`}>{user.points}</span>
                  <GiLaurelsTrophy />
                  <span className='ms-3 me-2'>{`${user.nickname}`}</span>
                </li>
              </>
            )}
            <li className='d-flex align-items-center nav-item mx-2 my-3'>
              <img
                alt={t('language.altes')!}
                width={20}
                className='lngButton me-3'
                src={spanish}
                onClick={() => changeLanguage('es')}
              />
              <img
                alt={t('language.alten')!}
                width={20}
                className='lngButton me-2'
                src={english}
                onClick={() => changeLanguage('en')}
              />
            </li>
            <li className='nav-item ms-2'>
              <span className='nav-link' role='button'>
                <ImUser />{' '}
                <span className='ms-2 d-lg-none d-inline'>mi perfil</span>
              </span>
            </li>
            <li className='nav-item ms-2'>
              <span onClick={signout} className='nav-link' role='button'>
                <MdLogout />{' '}
                <span className='ms-2 d-lg-none d-inline'>cerrar sesión</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
