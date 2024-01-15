import { useEffect, useState } from "react";
import Button from "./ui/Button";
import axiosInstance from "../config/axios.config";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    axiosInstance
      .get("/users/me?populate=todos", {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      })
      .then((res) => {
        console.log(setTodos(res.data.todos));
      });
  }, []);
  return (
    <div className="space-y-1 ">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
        >
          <p className="w-full font-semibold">{todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
