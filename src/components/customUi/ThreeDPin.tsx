"use client";
import React from "react";
import { PinContainer } from "../ui/3d-pin";

export default function ThreeDPin({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  return (
    <div className="h-full w-full flex items-center  ">
      <PinContainer title={title} href={url}>
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            {title}
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">{description}</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-purple-800 via-purple-700 to-blue-700" />
        </div>
      </PinContainer>
    </div>
  );
}
