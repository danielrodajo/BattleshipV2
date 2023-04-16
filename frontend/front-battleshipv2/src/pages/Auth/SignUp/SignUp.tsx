import React, { FC } from 'react';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';
import AuthInput from '../../../components/AuthInput/AuthInput';
import { CiUser, CiLock, CiMail } from 'react-icons/ci';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import {
  authSignUp,
  selectAuthStatus,
  selectSignUpError,
  signOut,
} from '../../../store/slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { PATH_SIGNIN } from '../../../utils/Routes';
import { toast } from 'react-toastify';
import { hideSpinner, showSpinner } from '../../../store/slices/SpinnerSlice';
import { useTranslation } from 'react-i18next';
import spanish from '../../../assets/spanish.png';
import english from '../../../assets/english.png';

interface SignUpProps {}

const SignUp: FC<SignUpProps> = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectAuthStatus);
  const signUpError = useAppSelector(selectSignUpError);

  React.useEffect(() => {
    dispatch(signOut());
  }, [dispatch]);

  React.useEffect(() => {
    if (status === 'loading') {
      dispatch(showSpinner());
    } else if (status === 'succeeded') {
      dispatch(hideSpinner());
      toast.success(t('signup.registersuccess'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate(PATH_SIGNIN);
    } else if (status === 'failed') {
      dispatch(hideSpinner());
      toast.error(signUpError, {
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
  }, [status, dispatch, navigate, signUpError]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (Object.keys(errors).length) {
      console.error(errors);
      return;
    }
    await dispatch(
      authSignUp({
        name: data.name,
        firstsurname: data.firstSurname,
        secondsurname: data.secondSurname,
        email: data.email,
        password: data.pwd,
      })
    );
  };

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className='vh-100 d-flex'>
      <div className={`${styles.SignUp} bg-light rounded-3 p-5`}>
        <div>
          <p className='user-select-none text-center text-capitalize font-bold fw-bold fs-2 mb-5'>
            {t('signup.title')}
          </p>
          <div className={styles.languages}>
            <img alt={t('language.altes')!} width={20} className='lngButton' src={spanish} onClick={() => changeLanguageHandler('es')}/>
            <img alt={t('language.alten')!} width={20} className='lngButton' src={english} onClick={() => changeLanguageHandler('en')}/>
          </div>
        </div>
        <form
          className='credentials form-group'
          onSubmit={handleSubmit(onSubmit)}
          autoComplete='on'
        >
          <div className='row'>
            <div className='col-4'>
              <div className='nameGroup'>
                <AuthInput
                  id='name'
                  type='text'
                  placeholder={t('signup.placeholdername')}
                  label={t('signup.inputname')}
                  required
                  register={register}
                  errors={errors}
                  autocomplete='given-name'
                  icon={CiUser}
                ></AuthInput>
              </div>
            </div>
            <div className='col-4'>
              <div className='firstSurnameGroup'>
                <AuthInput
                  id='firstSurname'
                  type='text'
                  placeholder={t('signup.placeholderfirstsur')}
                  label={t('signup.inputfirstsur')}
                  required
                  register={register}
                  errors={errors}
                  autocomplete='family-name'
                ></AuthInput>
              </div>
            </div>
            <div className='col-4'>
              <div className='secondSurnameGroup'>
                <AuthInput
                  id='secondSurname'
                  type='text'
                  placeholder={t('signup.placeholdersecondsur')}
                  label={t('signup.inputsecondsur')}
                  register={register}
                  errors={errors}
                  autocomplete='additional-name'
                ></AuthInput>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-4'>
              <div className='emailGroup'>
                <AuthInput
                  id='email'
                  type='text'
                  placeholder={t('signup.placeholderemail')}
                  label={t('signup.inputemail')}
                  required
                  register={register}
                  errors={errors}
                  autocomplete='email'
                  icon={CiMail}
                ></AuthInput>
              </div>
            </div>
            <div className='col-4'>
              <div className='repeatEmailGroup'>
                <AuthInput
                  id='repeatEmail'
                  type='text'
                  placeholder={t('signup.placeholderrepeatemail')}
                  label={t('signup.inputrepeatemail')}
                  required
                  register={register}
                  errors={errors}
                  autocomplete='email'
                  getValues={getValues}
                  compareId='email'
                  icon={CiMail}
                ></AuthInput>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-4'>
              <div className='pwdGroup'>
                <AuthInput
                  id='pwd'
                  type='password'
                  placeholder={t('signup.placeholderpwd')}
                  label={t('signup.inputpwd')}
                  required
                  register={register}
                  errors={errors}
                  autocomplete='new-password'
                  icon={CiLock}
                ></AuthInput>
              </div>
            </div>
            <div className='col-4'>
              <div className='repeatPwdGroup'>
                <AuthInput
                  id='repeatPwd'
                  type='password'
                  placeholder={t('signup.placeholderrepeatpwd')}
                  label={t('signup.inputrepeatpwd')}
                  required
                  register={register}
                  errors={errors}
                  autocomplete='new-password'
                  getValues={getValues}
                  compareId='pwd'
                  icon={CiLock}
                ></AuthInput>
              </div>
            </div>
          </div>
          <div className='row mt-5 justify-content-center'>
            <button className={`${styles.submitbtn} mt-3`} type='submit'>
              {t('signup.button')}
            </button>
          </div>
        </form>
        <div className='mt-5 text-center '>
          <p className={`${styles.grayText} text-capitalize`}>
            {t('signup.return')}
          </p>
          <p className='text-uppercase'>
            <Link to={PATH_SIGNIN} className='linkStyle'>
              {t('signup.returnbtn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
