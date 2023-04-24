import React, { FC } from 'react';
import Score from '../../components/Score/Score';
import { fetchUsersRanking } from '../../api/requests/userAPI';
import { RankingResponse } from '../../api/domain/responses/RankingResponse';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { hideSpinner, showSpinner } from '../../store/slices/SpinnerSlice';
import { toast } from 'react-toastify';

interface RankingProps {}

const Ranking: FC<RankingProps> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [ranking, setRanking] = React.useState<RankingResponse[]>([]);

  React.useEffect(() => {
    dispatch(showSpinner());
    fetchUsersRanking()
      .then((response) => {
        dispatch(hideSpinner());
        setRanking(response);
      })
      .catch((err) => {
        console.error(err);
        dispatch(hideSpinner());
        toast.error(t('error.generic'), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      });
  }, []);

  return (
    <>
      <p className='title'>{t('ranking.title')}</p>
      <Score ranking={ranking} />
    </>
  );
};

export default Ranking;
