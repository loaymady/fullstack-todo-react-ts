import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { useState } from "react";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";

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
        <div className="space-y-3">
          <Input value={todoToEdit.title} />
          <Textarea value={todoToEdit.description} />
        </div>
        <div className="flex items-center space-x-2 mt-6">
          <Button className="bg-indigo-700 hover:bg-indigo-800 w-full rounded-lg text-white px-3 py-3 duration-200 font-medium">
            Submit
          </Button>
          <Button
            variant={"cancel"}
            className="bg-gray-400 hover:bg-gray-600 w-full rounded-lg text-white px-3 py-3 duration-200 font-medium"
            onClick={onCloseEditModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
