"use client";
import { ImdbapiTitleSearch } from "@/lib/types/imdbapi";
import Link from "next/link";
import React from "react";

type SearchTitleCardProps = {
  searchTitle: ImdbapiTitleSearch;
};

const SearchTitleCard = ({ searchTitle }: SearchTitleCardProps) => {
  const { primaryTitle, primaryImage, startYear, id } = searchTitle;
  return (
    <div className="flex border border-gray-300 h-50 w-100 p-2 m-1 rounded-md">
      <img
        src={primaryImage?.url}
        height={"300px"}
        width={"auto"}
        className="mr-2"
      />
      <div className="flex flex-col">
        <div className="flex flex-row items-baseline">
          <Link href={`/title/${id}`} className="text-blue-500 text-2xl mr-1">
            {primaryTitle}
          </Link>
          <div>({startYear})</div>
        </div>
      </div>
    </div>
  );
};

export default SearchTitleCard;
