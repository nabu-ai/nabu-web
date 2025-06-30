import React from 'react'
import MeetingsTable from './MeetingsTable'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect } from 'react';
import { useGetMeetings } from './hooks/useGetMeetings';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { useUserStore } from '@/store/useUserStore';
import { useModal } from '@/hooks/useModal';
import NewMeetingForm from './components/NewMeetingForm';
import { Modal } from '../ui/modal';

const Meetings = () => {
    const hasInitialized = useRef(false);
    const { isOpen, openModal, closeModal } = useModal();
    const { data, isLoading, refetch } = useGetMeetings();
    const meetings = data?.data || []
    const activeMeetings = meetings?.filter((m: any) => m.status === "ACTIVE")
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            refetch();
        }
    }, []);

    const handleSave = () => {
        closeModal();
    };

    return (<><div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-2 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">

        <Tabs defaultValue="activeMeetings">
            <TabsList className="w-full py-8 px-2 gap-2">
                <TabsTrigger className="flex-none py-4" value='activeMeetings'>Active Meetings</TabsTrigger>
                <TabsTrigger className="flex-none py-4" value='allMeetings'>All Meetings</TabsTrigger>
                <div className="grow text-right p-1">
                    <Button
                        onClick={openModal}
                        disabled={useUserStore.getState().trialExpired}
                        size="sm"
                    >
                        New Instant Meeting
                    </Button>
                </div>
            </TabsList>
            <TabsContent value="activeMeetings">
                <MeetingsTable heading='Active Meetings' meetingData={activeMeetings} />
            </TabsContent>
            <TabsContent value="allMeetings">
                <MeetingsTable heading="All Meetings" meetingData={meetings} />
            </TabsContent>
        </Tabs>

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
    </>)
}

export default Meetings