export const PATH_HOME = '/';
export const PATH_RANKING = '/ranking';
export const PATH_MY_GAMES = '/my-games';
export const PATH_GAME_MODE = '/game-mode';
export const PATH_GAME = '/game/:code';
export const PATH_PREPARE_BOARD = '/game/board/:code';

export const PATH_PUBLIC = '/public';
export const PATH_SIGNIN = '/public/signin';
export const PATH_SIGNUP = '/public/signup';

export function passParameters(path: string, ...parameters: string[]): string {
    let auxPath = path;
    path.split('/').filter(param => param.startsWith(':')).forEach((param, i) => {
        auxPath = auxPath.replace(param, parameters[i]);
    });
    return auxPath;
}