import TableTitle from '../../databases/types/table_title';
import LocalDatasourceParameters from '../local_datasource_parameters';
import InstrumentCommentsDatasource from './instrument_comments_datasource';

const InstrumentCommentsLocalDatasource = ({
  sqlDatabase,
}: LocalDatasourceParameters): InstrumentCommentsDatasource => {
  const table = TableTitle.instrumentComments;

  return {
    getByUserIdAndInstrumentId: (userId: number, instrumentId: number) => {
      const script = `SELECT * FROM ${table}
      WHERE userId = ${userId} AND instrumentId = ${instrumentId}`;

      return sqlDatabase.get(script);
    },
  };
};

export default InstrumentCommentsLocalDatasource;

