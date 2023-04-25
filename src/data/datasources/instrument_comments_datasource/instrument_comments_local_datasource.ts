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
    update: ({ id, comment }) => {
      const script = `UPDATE ${table} SET comment = ${comment} 
        WHERE id = ${id}
      `;

      return sqlDatabase.run(script).then((v) => v.changes);
    },
    delete: (id) => {
      const script = `DELETE FROM ${table} WHERE id = ${id}`;

      return sqlDatabase.run(script).then((v) => v.changes);
    },
    create: ({ userId, instrumentId, comment }) => {
      const script = `INSERT INTO ${table} (userId, instrumentId, comment)
        VALUES(${userId}, ${instrumentId}, "${comment}")
      `;

      return sqlDatabase.run(script).then((v) => v.lastId);
    },
  };
};

export default InstrumentCommentsLocalDatasource;

