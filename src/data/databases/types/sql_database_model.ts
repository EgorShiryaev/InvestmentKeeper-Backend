import GetAllResult from './get_all_result';
import GetResult from './get_result';
import RunResult from './run_result';
import VoidCallback from './void_callback';

interface SqlDatabase {
    run: (sqlScript: string) => Promise<RunResult>;
    get: <T>(sqlScript: string) => Promise<GetResult<T>>;
    getAll: <T>(sqlScript: string) => Promise<GetAllResult<T>>;
    close: () => Promise<void>;
    serialize: (fun: VoidCallback) => void;
}

export default SqlDatabase;

