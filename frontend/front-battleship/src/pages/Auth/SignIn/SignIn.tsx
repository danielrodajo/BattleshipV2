import React, { FC } from 'react';
import styles from './SignIn.module.css';
import { CiUser, CiLock } from 'react-icons/ci';
import Facebook from '../../../assets/facebook.png';
import Google from '../../../assets/google.png';
import Twitter from '../../../assets/twitter.png';
import AuthInput from '../../../components/CustomInput/CustomInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  authSignIn,
  selectAuthStatus,
  selectSignInError,
  signOut,
} from '../../../store/slices/AuthSlice';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { PATH_SIGNUP } from '../../../Routes';
import { hideSpinner, showSpinner } from '../../../store/slices/SpinnerSlice';
import { toast } from 'react-toastify';
import { getUserData } from '../../../store/slices/AuthSlice';
import { useTranslation } from 'react-i18next';
import spanish from '../../../assets/spanish.png';
import english from '../../../assets/english.png';
import useLanguageHandler from '../../../hooks/useLanguageHandler';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleSignIn } from '../../../api/requests/authAPI';

interface SignInProps {}

const SignIn: FC<SignInProps> = () => {
  const { changeLanguage } = useLanguageHandler();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    dispatch(authSignIn({ username: data.email, password: data.password }));
  };

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const signInError = useAppSelector(selectSignInError);

  React.useEffect(() => {
    dispatch(signOut());
  }, [dispatch]);

  React.useEffect(() => {
    if (status === 'loading') {
      dispatch(showSpinner());
    } else if (status === 'succeeded') {
      dispatch(getUserData());
    } else if (status === 'failed') {
      dispatch(hideSpinner());
      toast.error(signInError, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  }, [status, dispatch, signInError]);
  

const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
        console.log(codeResponse); 
        const token = await googleSignIn(codeResponse.code);
        /* const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${codeResponse.access_token}` },
        })
        .then(res => res.data); */

      console.log(token);
    },
    onError: errorResponse => console.log(errorResponse),
    flow: 'auth-code'
});

  return (
    <div className='vh-100 d-flex'>
      {status && status === 'loading' && <h4>CARGANDO...</h4>}
      <div className={`${styles.SignIn} bg-light p-5`}>
        <div>
          <p className='user-select-none text-center text-capitalize font-bold fw-bold fs-2 mb-5'>
            {t('login.title')}
          </p>
          <div className={styles.languages}>
            <img
              alt={t('language.altes')!}
              width={20}
              className='lngButton'
              src={spanish}
              onClick={() => changeLanguage('es')}
            />
            <img
              alt={t('language.alten')!}
              width={20}
              className='lngButton'
              src={english}
              onClick={() => changeLanguage('en')}
            />
          </div>
        </div>
        <form
          className='credentials form-group'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='usernameGroup'>
            <AuthInput
              id='email'
              type='text'
              placeholder={t('login.placeholderemail')}
              label={t('login.inputemail')}
              register={register}
              errors={errors}
              required
              icon={CiUser}
            ></AuthInput>
          </div>
          <div className='pwdGroup mt-4'>
            <AuthInput
              id='password'
              type='password'
              placeholder={t('login.placeholderpwd')}
              label={t('login.inputpwd')}
              register={register}
              errors={errors}
              required
              icon={CiLock}
            ></AuthInput>
            <p className={`${styles.fgpwd} mt-2 text-capitalize`}>
              {t('login.forgotpwd')}
            </p>
          </div>
          <button className={`${styles.submitbtn} mt-3`} type='submit'>
            {t('login.button')}
          </button>
          <div className='mt-4 text-center '>
            <p className={`${styles.grayText} text-capitalize`}>
              {t('login.options1')}
            </p>
            <img
              width={50}
              height={50}
              className={styles.imgOauth}
              src={Facebook}
              alt='facebook'
            ></img>
            <img
              width={50}
              height={50}
              className={styles.imgOauth}
              src={Twitter}
              alt='twitter'
            ></img>
            <img
              width={43}
              height={43}
              className={`${styles.imgOauth} ms-1`}
              src={Google}
              onClick={() => googleLogin()}
              alt='google'
            ></img>
          </div>
          <div className='mt-5 text-center '>
            <p className={`${styles.grayText} text-capitalize`}>
              {t('login.options2')}
            </p>
            <p className='text-uppercase'>
              <Link to={PATH_SIGNUP} className='linkStyle'>
                {t('login.signup')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
