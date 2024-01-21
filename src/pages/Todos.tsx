import { useState } from "react";
import Button from "../components/ui/Button";
import { faker } from "@faker-js/faker";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import axiosInstance from "../config/axios.config";
import Paginator from "../components/Paginator";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodosPage = () => {
  const [isUpdated, setIsUpdated] = useState(false); // for spamming the update button
  const [queryKey, setQueryKey] = useState(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("DESC");

  const { isLoading, data, isFetching } = useAuthenticatedQuery({
    queryKey: ["TodosPage", `${page}`, `${pageSize},${sortBy},${queryKey}`],
    url: `/todos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:${sortBy}`,
    confing: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  });

  //Handlers

  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const onChangeSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
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

  if (isLoading) return <h3>Loading..</h3>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-7 space-x-2">
        <Button
          isLoading={isUpdated}
          variant={"outline"}
          className="p-2.5 border-2 border-indigo-600"
          size={"sm"}
          onClick={onGenerateTodos}
        >
          Generate todos
        </Button>
        <div className="flex items-center  space-x-2 text-md">
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={sortBy}
            onChange={onChangeSortBy}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>

          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="all-posts mb-6">
        {data?.data.length ? (
          data.data.map(
            (
              todo: { id: number; attributes: { title: string } },
              idx: number
            ) => (
              <div
                key={todo.id}
                className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
              >
                <p className="w-full font-semibold">
                  {idx + 1}- {todo.attributes.title}
                </p>
              </div>
            )
          )
        ) : (
          <h3>No todods yet!</h3>
        )}
      </div>
      <Paginator
        page={page}
        pageCount={data.meta.pagination.pageCount}
        total={data.meta.pagination.total}
        isLoading={isLoading || isFetching}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
      />
    </div>
  );
};

export default TodosPage;
