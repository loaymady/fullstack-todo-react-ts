
const TodoSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 duration-300 even:bg-gray-100">
      <div className="flex items-center space-x-4">
        <div>
          <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-24 h-2 bg-gray-200 rounded-full mt-2"></div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default TodoSkeleton;
