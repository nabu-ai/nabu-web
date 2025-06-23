"use client";
import { useUserStore } from "@/store/useUserStore";

export default function UserAddressCard({userInfo}) {
  
    // const userData = useUserStore.getState().userData;
    const {address, city, country, state, postalCode} = userInfo || {};


  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
                  {address}
                </p>
              </div>

              <div>
                <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                  City
                </p>
                <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
                  {city}
                </p>
              </div>



              <div>
                <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                  State
                </p>
                <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
                  {state}
                </p>
              </div>
              <div>
                <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
                 {postalCode}
                </p>
              </div>
              <div>
                <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
                  {country}
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
}
