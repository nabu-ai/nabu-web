"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import NewMeetingForm from "./components/NewMeetingForm";
import { useGetMeetings } from "./hooks/useGetMeetings";
import { Button } from "../ui/button";
import { toast } from "sonner";


export default function MeetingsTable() {
  const { data: meetings, isLoading } = useGetMeetings();
  const meetingList = meetings?.data || [];

  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    closeModal();
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "primary"
        break;
      case "Ongoing":
        return "success"
        break;
      case "Completed":
        return "error"
        break;
      case "Cancelled":
        return "warning"
        break;
      default:
        return "primary"
        break;
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Meeting link copied");
  };
  const headerCSS = "py-3 font-semibold text-gray-800 text-start text-theme-xl dark:text-gray-400";
  const cellCSS = "py-3 text-gray-700 text-theme-xl dark:text-gray-400";
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">Meetings</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openModal}
              disabled={false}
              className="text-theme-xl bg-brand-500 shadow-theme-md hover:bg-brand-600 disabled:bg-brand-300 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition"
            >
              New Instant Meeting
            </button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className={headerCSS}>
                  Agenda
                </TableCell>
                <TableCell isHeader className={headerCSS}>
                  Host
                  <br /> language
                </TableCell>
                <TableCell isHeader className={headerCSS}>
                  Participant
                  <br /> Name
                </TableCell>
                <TableCell isHeader className={headerCSS}>
                  Participant
                  <br /> Language
                </TableCell>
                <TableCell isHeader className={headerCSS}>
                  Duration
                </TableCell>
                <TableCell isHeader className={headerCSS}>
                  Meeting
                  <br /> Status
                </TableCell>
                <TableCell isHeader className={headerCSS}>
                  Meeting Link
                </TableCell>
                <TableCell isHeader>{""}</TableCell>
              </TableRow>
            </TableHeader>
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {meetingList.map(
                ({
                  meetingId,
                  agenda,
                  hostLanguage,
                  participants,
                  participantLanguage,
                  duration,
                  status,
                }) => {
                  const partName = participants[0]?.name
                  const partLang = participants[0]?.language
                  const partVoice = participants[0]?.voiceHeardAs
                  const meetingLink = `http://localhost:3000/nabu-web/guest?mid=${meetingId}`
                  return (
                    <TableRow key={meetingId} className="">
                      <TableCell className={cellCSS}>{agenda}</TableCell>
                      <TableCell className={cellCSS}>{hostLanguage}</TableCell>
                      <TableCell className={cellCSS}>{partName}</TableCell>
                      <TableCell className={cellCSS}>{partLang} ( {partVoice} )</TableCell>
                      <TableCell className={cellCSS}>{duration/60}</TableCell>
                      <TableCell className={cellCSS}>
                        <Badge
                          size="sm"
                          color={getMeetingStatusColor(status)}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-100 text-theme-xl overflow-text-wrap gap-3 py-3 text-gray-500 dark:text-gray-400">
                        <button onClick={() => copyToClipboard(meetingLink)}>
                          {meetingLink}
                        </button>
                      </TableCell>
                      <TableCell >
                        <Link href={meetingLink} target="_blank">
                          <Button variant="primary" size="sm" className="text-theme-lg w-20 py-1">
                            {" "}
                            Join
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">New Meeting</h4>
            <p className="text-theme-xl mb-6 text-gray-500 lg:mb-7 dark:text-gray-400">
              This is a trial meeting with only 10 minutes duration
            </p>
          </div>
          <NewMeetingForm onSubmit={handleSave} />
        </div>
      </Modal>
    </>
  );
}
