"use client";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { useUserStore } from "@/store/useUserStore";
import { EditProfileForm } from "./components";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";


export default function UserMeetingPreferencesCard({userInfo}) {

  const { isOpen, openModal, closeModal } = useModal();
  const userId = useUserStore.getState().loginData.userId
  //const userInfo = useUserStore.getState().userData;
  const {nonVerbal, hearingImpaired} = userInfo || {};


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Meeting Preferences
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="flex gap-3 items-center">
              <p className="mb-2 text-theme-lg font-semibold text-gray-500 dark:text-gray-400">
                Verbal Only
              </p>
              <Checkbox checked={nonVerbal} >
              </Checkbox>
            </div>

            <div className="flex gap-3 items-center">
              <p className="mb-2 text-theme-lg font-semibold text-gray-500 dark:text-gray-400">
               Hearing Impaired
              </p>
              <Checkbox checked={hearingImpaired}>
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
