import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { useState } from "react";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";
import { faker } from "@faker-js/faker";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodoList = () => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // for spamming the update button
  const [queryKey, setQueryKey] = useState(1);

  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${queryKey}`],
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

  const onChangeEditHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };
  const onChangeAddHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };

  const onSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setQueryKey((prev) => prev + 1);
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

  const onSubmitDelete = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setQueryKey((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdated(false);
    }
  };

  //for add todo
  const onOpenAddModal = () => {
    setIsOpenAddModal(true);
  };
  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModal(false);
  };

  const onSubmitAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, description } = todoToAdd;
    setIsUpdated(true);
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData?.user.id] } },
        {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseAddModal();
        setQueryKey((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdated(false);
    }
  };

  const onGenerateTodos = async () => {
    setIsUpdated(true);

    for (let i = 0; i < 20; i++) {
      try {
        await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(5),
              description: faker.lorem.paragraphs(2),
              user: [userData?.user.id],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData?.jwt}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
    setIsUpdated(false);
    setQueryKey((prev) => prev + 1);
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
    <div>
      <div className="flex items-center justify-center mb-5 space-x-2">
        <Button size={"sm"} onClick={onOpenAddModal}>
          Post new todo
        </Button>
        <Button
          isLoading={isUpdated}
          variant={"outline"}
          size={"sm"}
          onClick={onGenerateTodos}
        >
          Generate todos
        </Button>
      </div>
      <div className="all-posts mb-10">
        {data.todos.length ? (
          data.todos.map((todo: ITodo, idx: number) => (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">
                {idx + 1}- {todo.title}
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
      </div>

      <Modal
        isOpen={isOpenAddModal}
        closeModal={onCloseAddModal}
        title="Post A New Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitAdd}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeAddHandler}
          />
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={onChangeAddHandler}
          />
          <div className="flex items-center space-x-2 mt-6">
            <Button
              isLoading={isUpdated}
              className="bg-indigo-700 hover:bg-indigo-800 w-fit rounded-lg text-white px-3 py-3 duration-200 font-medium"
            >
              Add
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isOpenEditModal}
        closeModal={onCloseEditModal}
        title="Edit your Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitUpdate}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeEditHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeEditHandler}
          />
          <div className="flex items-center space-x-2 mt-6">
            <Button isLoading={isUpdated}>Update</Button>
            <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={onCloseConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <form className="space-y-3" onSubmit={onSubmitDelete}>
          <div className="flex items-center space-x-2 mt-6">
            <Button isLoading={isUpdated} variant={"danger"}>
              Yes, remove
            </Button>
            <Button
              type="button"
              variant={"cancel"}
              onClick={onCloseConfirmModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
