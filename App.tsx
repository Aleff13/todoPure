/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */

import {useState, useEffect, useCallback} from 'react';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import styles from './styles/base.style';
import {IItem} from './models';

import DatePicker from 'react-native-date-picker';

import {Dialog, ListItem} from 'react-native-elements';

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

const updateById = (id: number, func: void) => {
  db.transaction(
    (tx: any) => {
      tx.executeSql('update todo3 set done = 1 where id = ?;', [id]);
    },
    null,
    func,
  );
};

const deleteById = (id: number, func: void) => {
  db.transaction(
    (tx: any) => {
      tx.executeSql('delete from todo3 where id = ?;', [id]);
    },
    null,
    func,
  );
};

const insertItem = (todo: IItem, calbackFn: any) => {
  db.transaction(
    (tx: SQLite.Transaction) => {
      tx.executeSql(
        `INSERT INTO todo3 (done, value, date)
      VALUES(0, ?, ?);
      `,
        [todo.value, todo.date],
      );
    },
    error => {
      console.log(error);
    },
    () => calbackFn,
  );
};


const Items = ({done: doneHeading, onPressItem}) => {
  const [items, setItems] = useState<Array<IItem>>([]);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  const getData = useCallback((doneHeading: any) => {
    db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        'select * from todo3 where done = ?',
        [doneHeading ? 1 : 0],
        (_tx: any, results: SQLite.ResultSet) => {
          let todo = results.rows.raw() as unknown as IItem[];
          console.log(todo);
          setItems(todo);
        },
      );
      forceUpdate;
    });
  }, []);

  useEffect(() => {
    getData(doneHeading);
  }, [setItems, doneHeading, onPressItem]);

  const heading = doneHeading ? 'Completed' : 'Todo';

  if (items === null || items?.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items?.map((item, index) => (
        <ListItem
          key={index}
          onPress={() => onPressItem && onPressItem(item.id)}>
          <ListItem.Content
            style={
              !item.done &&
              new Date(item.date).getTime() - new Date().getTime() < 0
                ? styles.todo
                : styles.finished
            }>
            <ListItem.Title>{item.value.toString()}</ListItem.Title>
            <ListItem.Subtitle>
              {new Date(item.date).toISOString().split('T')[0]}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};

const App = () => {
  const [text, setText] = useState(null);
  const [date, setDate] = useState(new Date());
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const createTable = (tableName = 'todo3') => {
    db.transaction((tx: SQLite.Transaction) => {
      tx.executeSql(
        `create table if not exists ${tableName} (id integer primary key not null, done int, value text, date text);`,
      );
    });
  };



  useEffect(() => {
    createTable();
  }, []);

  const add = (text: string, date: string) => {
    // is text empty?
    if (text === null || text === '') {
      return false;
    }

    if (date === null || date === '') {
      return false;
    }

    let cleanDate = new Date(date).toISOString();
    const todo: IItem = {
      value: text,
      date: cleanDate,
    };
    insertItem(todo, forceUpdate);
  };

  return (
    <View style={{top: 90}}>
      <Text style={styles.heading}>TODO App</Text>
      <>
        <View style={styles.flexRow}>
          <Button
            title="Adicionar lembrete"
            style={{margin: 16}}
            onPress={() => setVisible(true)}
          />
          <Dialog isVisible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title title="Adicionar lembrete" />
            <View
              style={{
                width: '60%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Digite a descrição/título e a data de expiração</Text>
              <TextInput
                style={{
                  borderColor: '#545454',
                  borderWidth: 1,
                  width: '100%',
                  borderRadius: 10,
                }}
                onChangeText={text => setText(text)}
              />
              <DatePicker
                date={date}
                open={open}
                onDateChange={date => setDate(date)}
                onConfirm={date => {
                  setDate(date);
                  setOpen(false);
                  forceUpdate;
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
            <Dialog.Actions>
              <Dialog.Button
                title="Cancelar"
                onPress={() => setVisible(false)}
              />
              <Dialog.Button
                title="Salvar"
                onPress={() => {
                  // add(text);
                  add(text, date.toISOString());
                  setText(null);
                  setVisible(false);
                }}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
        <ScrollView>
          <Items
            style={{margin: 10, padding: 10}}
            key={`forceupdate-todo-${forceUpdateId}`}
            done={false}
            onPressItem={id => updateById(id, forceUpdate)}
          />
          <Items
            style={{margin: 10, padding: 10}}
            done
            key={`forceupdate-done-${forceUpdateId}`}
            onPressItem={id => deleteById(id, forceUpdate)}
          />
        </ScrollView>
      </>
    </View>
  );
};

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
};

export default App;
