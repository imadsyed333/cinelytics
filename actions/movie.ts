"use server";
export const search = async (formData: FormData) => {
  const query = formData.get("query");
  console.log(query);
};
