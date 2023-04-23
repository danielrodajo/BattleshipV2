import { BoxDomain } from '../api/domain/BoxDomain';
import { EmptyBoxDomain } from '../api/domain/EmptyBoxDomain';
import {
  hitMissed,
  hitMyBox,
  hitOpponentBox,
  hitOpponentMissed,
  updateIsMyTurn,
} from '../store/slices/GameSlice';
import {
  WS_HITTED,
  WS_MISSED,
  WS_TURN,
  WS_TURN_MISSED,
} from '../utils/Constants';
import { useAppDispatch } from './reduxHooks';
import useHistory from './useHistory';
import { GameDomain } from '../api/domain/GameDomain';

const useWebSocketResponse = () => {
  const { createHistory } = useHistory();
  const dispatch = useAppDispatch();
  const manageResponse = (
    response: [string, string],
    game: GameDomain
  ): string | null => {
    switch (response[0]) {
      case WS_HITTED:
        {
          dispatch(updateIsMyTurn(false));
          const box: BoxDomain = JSON.parse(response[1]);
          dispatch(hitOpponentBox(box));
          createHistory(box, null, false, game);
        }
        break;
      case WS_TURN:
        {
          dispatch(updateIsMyTurn(true));
          const box: BoxDomain = JSON.parse(response[1]);
          dispatch(hitMyBox(box));
          createHistory(box, null, true, game);
        }
        break;
      case WS_TURN_MISSED:
        {
          dispatch(updateIsMyTurn(true));
          const emptyBox: EmptyBoxDomain = JSON.parse(response[1]);
          dispatch(hitMissed(emptyBox));
          createHistory(null, emptyBox, true, game);
        }
        break;
      case WS_MISSED:
        {
          dispatch(updateIsMyTurn(false));
          const emptyBox: EmptyBoxDomain = JSON.parse(response[1]);
          dispatch(hitOpponentMissed(emptyBox));
          createHistory(null, emptyBox, false, game);
        }
        break;
      default:
        return response[0];
    }
    return null;
  };

  return {
    manageResponse,
  };
};

export default useWebSocketResponse;
