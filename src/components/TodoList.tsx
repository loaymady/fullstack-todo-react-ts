import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { useState } from "react";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodoList = () => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });

  const { isPending, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    confing: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  });

  //Hadlers
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenEditModal(true);
  };
  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenEditModal(false);
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, title, description } = todoToEdit;
    const res = await axiosInstance.put(
      `/todos/${id}`,
      { data: { title, description } },
      {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`,
        },
      }
    );
    console.log(res.data.data.attributes);
  };

  if (isPending) return "Loading...";

  return (
    <div className="space-y-1 ">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todods yet!</h3>
      )}
      <Modal
        isOpen={isOpenEditModal}
        closeModal={onCloseEditModal}
        title="Edit your Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitHandler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center space-x-2 mt-6">
            <Button className="bg-indigo-700 hover:bg-indigo-800 w-full rounded-lg text-white px-3 py-3 duration-200 font-medium">
              Submit
            </Button>
            <button
              className="bg-gray-400 hover:bg-gray-600 w-full rounded-lg text-white px-3 py-3 duration-200 font-medium"
              onClick={onCloseEditModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
