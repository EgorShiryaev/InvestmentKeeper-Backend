const storage = new Map<number, string[] | undefined>();

const add = (userId: number, figi: string) => {
  const value = storage.get(userId);
  storage.set(userId, value ? [...value, figi] : [figi]);
};

const remove = (userId: number, figi: string) => {
  const value = storage.get(userId);
  storage.set(userId, value ? value.filter((v) => v !== figi) : []);
};

const getAll = (userId: number) => {
  return storage.get(userId);
};

const removeAll = (userId: number) => {
  return storage.set(userId, []);
};

const UserQuotesSubscibesRepository = {
  add: add,
  remove: remove,
  getAll: getAll,
  removeAll: removeAll,
};

export default UserQuotesSubscibesRepository;

