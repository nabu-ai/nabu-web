"use client";
import { Checkbox } from "../ui/checkbox";
import { languagesMap } from "@/constants/languages";
import { titleCase } from "@/lib/utils";


export default function UserMeetingPreferencesCard({userInfo}) {

  
  const {nonVerbal, hearingImpaired, preferredLanguage, spokenInVoice} = userInfo || {};


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Meeting Preferences
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                 Preferred Language
              </p>
              <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
               {languagesMap[preferredLanguage]}
              </p>
            </div>

            <div>
              <p className="mb-2 text-theme-sm leading-normal text-gray-500 dark:text-gray-400">
                Spoken In Voice
              </p>
              <p className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
                 {titleCase(spokenInVoice)}
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <p className="mb-2 text-theme-lg font-semibold text-gray-500 dark:text-gray-400">
                Verbal Only
              </p>
              <Checkbox checked={nonVerbal} disabled>
              </Checkbox>
            </div>

            <div className="flex gap-3 items-center">
              <p className="mb-2 text-theme-lg font-semibold text-gray-500 dark:text-gray-400">
               Hearing Impaired
              </p>
              <Checkbox checked={hearingImpaired} disabled>
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
