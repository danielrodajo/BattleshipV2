import { FC } from 'react';
import Score from '../../components/Score/Score';

interface RankingProps {}

const Ranking: FC<RankingProps> = () => (
  <>
    <p className='title'>Ranking</p>
    <Score />
  </>
);

export default Ranking;
