const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites'
};

const EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const Mode = {
  DEFAULT: 'default',
  POPUP: 'popup'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIEBUFF: 'Movie Buff'
};

export {FilterType, EMOJIS, Mode, SortType, UserAction, UpdateType, UserRank};
