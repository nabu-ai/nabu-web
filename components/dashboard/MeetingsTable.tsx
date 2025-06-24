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
import { Button } from "../ui/button";
import { toast } from "sonner";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Meeting link copied")
  }
   const headerCSS = "py-3 font-semibold text-gray-800 text-start text-theme-xl dark:text-gray-400"
   const cellCSS= "py-3 text-gray-700 text-theme-xl dark:text-gray-400";
  return (<>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
            Meetings
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={openModal} disabled={true} className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full px-4 py-3 text-theme-xl bg-brand-500 text-white shadow-theme-md hover:bg-brand-600 disabled:bg-brand-300 ">
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
                className={headerCSS}
              >
                Agenda
              </TableCell>
              <TableCell
                isHeader
                className={headerCSS}
              >
                Host<br /> language
              </TableCell>
              <TableCell
                isHeader
               className={headerCSS}
              >
                Participant<br /> Name
              </TableCell>
              <TableCell
                isHeader
               className={headerCSS}
              >
                Participant<br /> Language
              </TableCell>
              <TableCell
                isHeader
                className={headerCSS}
              >
                Duration
              </TableCell>
              <TableCell
                isHeader
                className={headerCSS}
              >
                Meeting<br /> Status
              </TableCell>
              <TableCell
                isHeader
                className={headerCSS}
              >
                Meeting Link
              </TableCell>
              <TableCell
                isHeader
              >
                {""}
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map(({ id, agenda, language, participant, participantLanguage, duration, status, meetingLink }) => (
              <TableRow key={id} className="">
                <TableCell className={cellCSS}>
                  {agenda}
                </TableCell>
                <TableCell className={cellCSS}>
                  {language}
                </TableCell>
                <TableCell className={cellCSS}>
                  {participant}
                </TableCell>
                <TableCell className={cellCSS}>
                  {participantLanguage}
                </TableCell>
                <TableCell className={cellCSS}>
                  {duration}
                </TableCell>
                <TableCell className={cellCSS}>
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
                <TableCell className="py-3 text-gray-500 text-theme-xl dark:text-gray-400 gap-3 overflow-text-wrap">
                  <button onClick={() => copyToClipboard("/nabu-web/guest?id='xyz'")}>{meetingLink}</button>
                </TableCell>
                <TableCell>
                  <Link href={meetingLink} target="_blank">
                    <Button variant="primary" size="sm" className="text-theme-lg py-1 w-20"> Join
                    </Button>
                  </Link>
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
        <NewMeetingForm onSubmit={handleSave} />
      </div>
    </Modal>
  </>
  );
}
