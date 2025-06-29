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

const Meetings = () => {
    const hasInitialized = useRef(false);
    const { data, isLoading, refetch } = useGetMeetings();
    const meetings = data?.data || []
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            refetch();
        }
    }, []);
    const activeMeetings = meetings?.filter((m: any) => m.status === "ACTIVE")
    return (
        <Tabs defaultValue="activeMeetings">
            <TabsList>
                <TabsTrigger value='activeMeetings'>Active Meetings</TabsTrigger>
                <TabsTrigger value='allMeetings'>All Meetings</TabsTrigger>
            </TabsList>
            <TabsContent value="activeMeetings">
                <MeetingsTable heading='Active Meetings' meetingData={activeMeetings} />
            </TabsContent>
            <TabsContent value="allMeetings">
                <MeetingsTable heading="All Meetings" meetingData={meetings} />
            </TabsContent>
        </Tabs>
    )
}

export default Meetings