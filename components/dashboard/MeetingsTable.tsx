"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import NewMeetingForm from "./components/NewMeetingForm";
import { useGetMeetings } from "./hooks/useGetMeetings";

// Define the TypeScript interface for the table rows
interface Product {
  id: number;
  agenda: string;
  language: string;
  participant: string;
  participantLanguage: string;
  duration: string;
  status: "Completed" | "Active" | "Canceled";
  meetingLink: string;
}

const tableData: Product[] = [
  {
    id: 1,
    agenda: "Daily Standup",
    language: "en-US",
    participant: "John",
    participantLanguage: "hi-In",
    duration: "10 Minutes",
    status: "Active",
    meetingLink: "https://nabu.com/meeting/sdf-jhg-ioh"
  },
  {
    id: 2,
    agenda: "Sales discussion",
    language: "en-US",
    participant: "John",
    participantLanguage: "hi-In",
    duration: "10 Minutes",
    status: "Active",
    meetingLink: "https://nabu.com/meeting/sdf-jhg-ioh"
  },
  {
    id: 3,
    agenda: "PI Planning",
    language: "German",
    participant: "John",
    participantLanguage: "Hindi",
    duration: "10 Minutes",
    status: "Active",
    meetingLink: "https://nabu.com/meeting/sdf-jhg-ioh"
  },
  {
    id: 4,
    agenda: "Test Call",
    language: "Italian",
    participant: "John",
    participantLanguage: "hi-In",
    duration: "10 Minutes",
    status: "Canceled",
    meetingLink: "https://nabu.com/meeting/sdf-jhg-ioh"
  },
  {
    id: 5,
    agenda: "Internal Discussions",
    language: "Japanese",
    participant: "John",
    participantLanguage: "Korean",
    duration: "10 Minutes",
    status: "Completed",
    meetingLink: "https://nabu.com/meeting/sdf-jhg-ioh"
  },
];

export default function MeetingsTable() {
  const { data: meetings, isLoading } = useGetMeetings();

  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    closeModal();
  };

  return (<>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Meetings
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-xl font-medium text-gray-700 shadow-theme-md hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button> */}
          <button onClick={openModal} className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full px-4 py-3 text-theme-xl bg-brand-500 text-white shadow-theme-md hover:bg-brand-600 disabled:bg-brand-300 ">
            New Instant Meeting
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Agenda
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Host language
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Participant Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Participant Language
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Duration
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Meeting Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xl dark:text-gray-400"
              >
                Meeting Link
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map(({ id, agenda, language, participant, participantLanguage, duration, status, meetingLink }) => (
              <TableRow key={id} className="">
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  {agenda}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  {language}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  {participant}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  {participantLanguage}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  {duration}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      status === "Active"
                        ? "success"
                        : status === "Canceled"
                          ? "warning"
                          : "error"
                    }
                  >
                    {status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400">
                  <Link href={meetingLink}>{meetingLink}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            New Meeting
          </h4>
          <p className="mb-6 text-theme-xl text-gray-500 dark:text-gray-400 lg:mb-7">
            This is a trial meeting with only 10 minutes duration
          </p>
        </div>
        <NewMeetingForm onSubmit={handleSave}/>
      </div>
    </Modal>
  </>
  );
}
