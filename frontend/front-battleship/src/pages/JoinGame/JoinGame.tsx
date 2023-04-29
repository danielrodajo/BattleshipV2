import React, { FC } from 'react';
import styles from './JoinGame.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { joinGame } from '../../api/requests/gameAPI';
import { PATH_HOME, PATH_PREPARE_GAME, passParameters } from '../../Routes';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface JoinGameProps {}

const JoinGame: FC<JoinGameProps> = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (code) {
      joinGame(code)
        .then((response) => {
          navigate(passParameters(PATH_PREPARE_GAME, response));
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
          navigate(PATH_HOME);
        });
    }
  }, []);

  return <div className={styles.JoinGame}></div>;
};

export default JoinGame;
