import { RecordData } from '../api/data/RecordData';
import { BoxDomain } from '../api/domain/BoxDomain';
import { EmptyBoxDomain } from '../api/domain/EmptyBoxDomain';
import { GameDomain } from '../api/domain/GameDomain';
import { addGameRecord } from '../store/slices/GameSlice';
import { letters } from '../utils/Constants';
import { useAppDispatch } from './reduxHooks';

const useHistory = () => {
  const dispatch = useAppDispatch();

  const createHistory = (
    box: BoxDomain | null,
    empty: EmptyBoxDomain | null,
    isOpponent: boolean,
    game: GameDomain | null
  ) => {
    let x = 0;
    let y = 0;
    let type = '';
    if (box) {
      x = box.x;
      y = box.y;
      type = 'BOX';
    } else if (empty) {
      x = empty.x;
      y = empty.y;
      type = 'EMPTY';
    } else {
      return;
    }
    const newRecord: RecordData = {
      x: letters[x],
      y: y + 1,
      createdAt: new Date(),
      player: isOpponent ? game!.board1.owner : game!.board2.owner,
      type,
    };
    dispatch(addGameRecord(newRecord));
  };

  return {
    createHistory,
  };
};

export default useHistory;
