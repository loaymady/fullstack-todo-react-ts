import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodoList = () => {
  const { isPending, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    confing: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  });

  if (isPending) return "Loading...";

  return (
    <div className="space-y-1 ">
      {data.todos.length ? (
        data.todos.map((todo: { id: number; title: string }) => (
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
        ))
      ) : (
        <h3>No todods yet!</h3>
      )}
    </div>
  );
};

export default TodoList;
