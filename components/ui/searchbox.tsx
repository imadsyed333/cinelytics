import Form from "next/form";

const SearchBox = () => {
  return (
    <Form action={"/search"} className="flex flex-row">
      <input
        name="query"
        placeholder="Enter a movie title"
        className="full rounded-lg border border-gray-300 px-4 py-2
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-[#06356c] text-white px-2 ml-1"
      >
        Search
      </button>
    </Form>
  );
};

export default SearchBox;
