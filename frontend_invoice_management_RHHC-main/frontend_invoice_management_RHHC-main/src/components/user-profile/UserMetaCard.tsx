"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/modules/common/helpers/capitalizeWords";


export default function UserMetaCard() {
  const { user } = useAuth();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-800">
                {user.name?.split(" ")[0]?.[0].toUpperCase()}
                {user.name?.split(" ")[1]?.[0]?.toUpperCase()}
              </div>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {capitalizeFirstLetter(user.name)}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {capitalizeFirstLetter(user.role_name)}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
