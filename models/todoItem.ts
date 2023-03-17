export interface ToDoItem {
  id: number;
  value: string;
}
export interface IItem {
  id?: number;
  done: boolean;
  value: string;
  date?: string;
}
