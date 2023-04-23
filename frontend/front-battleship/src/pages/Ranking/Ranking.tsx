import React, { FC } from 'react';
import Score from '../../components/Score/Score';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { fetchUsersRanking } from '../../api/requests/userAPI';
import { RankingResponse } from '../../api/domain/requests/RankingResponse';

interface RankingProps {}

const Ranking: FC<RankingProps> = () => {
  const dispatch = useAppDispatch();
  const [ranking, setRanking] = React.useState<RankingResponse[]>([]);

  React.useEffect(() => {
    fetchUsersRanking().then((response) => {
      setRanking(response);
    });
  }, []);

  return (
    <>
      <p className='title'>Ranking</p>
      <Score ranking={ranking} />
    </>
  );
};

export default Ranking;
