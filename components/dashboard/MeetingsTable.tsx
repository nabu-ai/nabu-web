"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useModal } from "@/hooks/useModal";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ExternalLinkIcon } from "lucide-react";
import { languagesMap } from "@/constants/languages";
import { cn, formatTimeDuration, titleCase } from "@/lib/utils";
import { useCancelMeeting } from "./hooks/useCancelMeeting";
import ModalComponent from "../modal";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";
import { useRouter } from "next/navigation";
import { NABU_DOMAIN } from "@/constants/environmentVariables";
import { format } from 'date-fns';

export default function MeetingsTable({ heading, meetingData }: { heading: string, meetingData: any }) {
  const router = useRouter();
  const { mutateAsync: cancelMeeting } = useCancelMeeting();
  const {
    isOpen: isConfirmationOpen,
    openModal: openConfirmationModeal,
    closeModal: closeConfirmationModal,
  } = useModal();

  const tenantId = useUserStore().getLoginData().tenantId;
  const [selectedMeeting, setSelectedMeeting] = useState("");

  const meetingList = meetingData || [];

  const handleCancelMeeting = async (meetingId: string) => {
    setSelectedMeeting(meetingId);
    //
    openConfirmationModeal();
  };

  const confCancelMeeting = async () => {
    await cancelMeeting(selectedMeeting);
    closeConfirmationModal()
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "primary";
        break;
      case "ONGOING":
        return "success";
        break;
      case "COMPLETED":
        return "error";
        break;
      case "CANCELLED":
        return "warning";
        break;
      default:
        return "primary";
        break;
    }
  };

  const copyToClipboard = (text: string, status: string) => {
    if (status === "CANCELLED") {
      toast.warning("Meeting link expired", {
        className: "bg-red-500 text-white px-6 py-5 text-lg",
      });
    } else if (status === "COMPLETED") {
      toast.warning("Meeting completed", {
        className: "bg-red-500 text-white px-6 py-5 text-lg",
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Meeting link copied", {
        className: "bg-green-500 text-white px-6 py-5 text-lg",
      });
    }
  };

  const handleStartMeeting = (meeting: any) => {
    useMeetingStore.setState({
      meetingInfo: meeting,
    });
    setTimeout(() => {
      router.push(`/lobby`);
    }, 1000);
  };

  const headerCSS = "px-1 py-1 font-semibold text-gray-800 text-start text-theme-md dark:text-gray-400";
  const cellCSS = "px-1 py-1 text-gray-700 text-theme-md dark:text-gray-400";

  return (
    <>
      <div className="max-w-full overflow-x-auto lg:overflow-auto lg:h-[calc(100vh-350px)] lg:min-h-40">
        <Table className="table-auto md:table-fixed">
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
                Created On
              </TableCell>
              <TableCell isHeader className={headerCSS}>
                Meeting
                <br /> Status
              </TableCell>
              <TableCell isHeader className={headerCSS}>
                Duration
                <br /> Consumed
              </TableCell>
              <TableCell isHeader className={headerCSS}>
                Meeting Link
              </TableCell>
              <TableCell isHeader className={headerCSS}>
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {meetingList.map((meeting: any) => {
              const partName = meeting.participants[0]?.name;
              const partLang = meeting.participants[0]?.language;
              const partVoice = meeting.participants[0]?.voiceHeardAs;
              const meetingLink = `${NABU_DOMAIN}/nabu-web/guest?mid=${meeting.meetingId}&oid=${tenantId}`;
              return (
                <TableRow key={meeting.meetingId} className="">
                  <TableCell className={cellCSS}>{meeting.agenda}</TableCell>
                  <TableCell className={cellCSS}>{languagesMap[meeting.hostLanguage]}</TableCell>
                  <TableCell className={cellCSS}>{partName}</TableCell>
                  <TableCell className={cellCSS}>
                    {languagesMap[partLang]} {(partVoice ? titleCase(partVoice) : "-")}
                  </TableCell>
                  <TableCell className={cellCSS}>{format(new Date(meeting.createdOn * 1000), "MM-dd-yyyy hh:mm a")}</TableCell>
                  <TableCell className={cellCSS}>
                    <Badge color={getMeetingStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={cellCSS}>{formatTimeDuration(meeting.consumedDuration)}</TableCell>
                  <TableCell className="text-theme-xl overflow-text-wrap w-50 gap-3 py-3 text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => copyToClipboard(meetingLink, meeting.status)}
                      className="hover:text-primary flex items-center gap-2 transition"
                      title={meetingLink}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      <span>Copy Link</span>
                    </button>
                  </TableCell>
                  <TableCell className="flex gap-3">
                    {meeting.status === "ACTIVE" && (
                      <Button
                        onClick={() => handleStartMeeting(meeting)}
                        variant="primary"
                        size="xs"
                        className="text-theme-lg w-20 py-1"
                      >
                        Start
                      </Button>
                    )}
                    {(meeting.status === "ACTIVE" || meeting.status === "CANCELLED") && (
                      <Button
                        onClick={() => handleCancelMeeting(meeting.meetingId)}
                        disabled={meeting.status === "CANCELLED"}
                        variant="primary"
                        size="xs"
                        className={cn(
                          "bg-error-500 text-theme-lg hover:bg-error-700 w-20 py-1",
                          meeting.status === "CANCELLED" ? "disabled:bg-error-400" : "",
                        )}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <ModalComponent
        heading="Meeting Confirmation"
        description="Are you sure to cancel the meeting?"
        isOpen={isConfirmationOpen}
        closeModal={closeConfirmationModal}
      >
        <Button onClick={confCancelMeeting} variant="primary" size="xs" className="text-theme-lg w-20 py-1">
          Yes
        </Button>
        <Button
          onClick={closeConfirmationModal}
          variant="primary"
          size="xs"
          className="bg-error-500 text-theme-lg hover:bg-error-700 w-20 py-1 ml-5"
        >
          No
        </Button>
      </ModalComponent>
    </>
  );
}
