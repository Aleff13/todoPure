/* eslint-disable prettier/prettier */
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'dbnew',
    location: 'default',
  },
  () => {},
  error => {
    console.error(error);
  },
);

const createTable = async () => {
  await db.transaction((tx: any) => {
    tx.executeSql(
      'create table if not exists items (id integer primary key not null, done int, value text, date text);',
    );
  });
};

const insertItem = async (text: string, date: string, calbackFn: void) => {
  db.transaction(
    (tx: any) => {
      tx.executeSql('insert into items (done, value, date) values (0, ?, ?)', [
        text,
        date,
      ]);
      tx.executeSql('select * from items', [], (_, {rows}) =>
        console.log(JSON.stringify(rows)),
      );
    },
    null,
    calbackFn,
  );
};

const updateById = async (id: number, func: void) => {
  await db.transaction(
    (tx: any) => {
      tx.executeSql('update items set done = 1 where id = ?;', [id]);
    },
    null,
    func,
  );
};

const deleteById = async (id: number, func: void) => {
  await db.transaction(
    (tx: any) => {
      tx.executeSql('delete from items where id = ?;', [id]);
    },
    null,
    func,
  );
};

const selectItems = async (doneHeading: any, func: any) => {
  await db.transaction((tx: any) => {
    tx.executeSql(
      'select * from items where done = ?;',
      [doneHeading ? 1 : 0],
      (_, {rows: {_array}}) => {
        console.log(_array)
        func(_array)},
    );
  });
};

export {db, createTable, deleteById, insertItem, selectItems, updateById};
