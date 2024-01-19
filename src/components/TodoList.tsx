import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { useState } from "react";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodoList = () => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // for spamming the update button

  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
    url: "/users/me?populate=todos",
    confing: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  });

  //Handlers
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

  const onSubmitUpdateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, title, description } = todoToEdit;
    setIsUpdated(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${id}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseEditModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdated(false);
    }
  };

  //for delete todo
  const onOpenConfirmModal = (todo: ITodo) => {
    setIsOpenConfirmModal(true);
    setTodoToEdit(todo);
  };

  const onCloseConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };

  const onSubmitDeleteHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id } = todoToEdit;
    setIsUpdated(true);
    try {
      const { status } = await axiosInstance.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`,
        },
      });
      if (status === 200) {
        onCloseConfirmModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdated(false);
    }
  };

  //For render Loading
  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <TodoSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 ">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">
              {todo.id}- {todo.title}
            </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => onOpenConfirmModal(todo)}
              >
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
        <form className="space-y-3" onSubmit={onSubmitUpdateHandler}>
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
            <Button
              isLoading={isUpdated}
              className="bg-indigo-700 hover:bg-indigo-800 w-fit rounded-lg text-white px-3 py-3 duration-200 font-medium"
            >
              Update
            </Button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-600 w-fit rounded-lg text-white px-3 py-3 duration-200 font-medium"
              onClick={onCloseEditModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={onCloseConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <form className="space-y-3" onSubmit={onSubmitDeleteHandler}>
          <div className="flex items-center space-x-2 mt-6">
            <Button isLoading={isUpdated} variant={"danger"}>
              Yes, remove
            </Button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-600 w-fit rounded-lg text-white px-3 py-3 duration-200 font-medium"
              onClick={onCloseConfirmModal}
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
