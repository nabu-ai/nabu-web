import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { guestMeetingSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { getVoiceFromLanguageCode } from "@/constants/voiceMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languagesMap } from "@/constants/languages";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMeetingStore } from "@/store/useMeetingStore";
import { Input } from "@/components/ui/input";
import { email } from "zod/dist/types/v4/core/regexes";
import { useUpdateGuestMeeting } from "@/components/guest/hooks/useUpdateGuestMeeting";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useGuestLogin } from "@/components/guest/hooks/useGuestLogin";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow"

const GuestMeetingForm = () => {
 // const meetingInfo = useMeetingStore((meetingInfo) => meetingInfo.meetingInfo);
  //const meetingInfo = useMeetingStore(useShallow((state) => state.meetingInfo.meetingInfo));
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);

  const { mutateAsync: getGuestLoginInfo, isPending:isGuestLoading, isSuccess:isGuestSuccess } = useGuestLogin();
 // console.log("Meetign data for guest:::", meetingInfo);
  
  const [hasMaleVoiceParticipant, setHasMaleVoiceParticipant] = useState(false);
  const [hasFemaleVoiceParticipant, setHasFemaleVoiceParticipant] = useState(false);
  const router = useRouter();

  const { mutateAsync: handleUpdateGuestMeeting, isSuccess } = useUpdateGuestMeeting();

  const form = useForm<z.infer<typeof guestMeetingSchema>>({
    resolver: zodResolver(guestMeetingSchema),
    defaultValues: {
      name: meetingInfo?.participants?.[0].name,
      language: "",
      voiceHeardAs: "",
      nonVerbal: false,
      hearingImpaired: false
    },
  });
  useEffect(() => {
    const language = form.watch("language");
    const voices = getVoiceFromLanguageCode(language);

    setHasMaleVoiceParticipant(Boolean(voices?.male));
    setHasFemaleVoiceParticipant(Boolean(voices?.female));
  }, [form.watch("language")]);


  useEffect(() => {
    form.setValue("name", meetingInfo.participants?.[0].name)
  }, [ meetingInfo.participants])

  const handleSubmit = async (data: z.infer<typeof guestMeetingSchema>) => {
    const meetingPayload = {
      id: meetingInfo.participants?.[0].id,
      name: meetingInfo.participants?.[0].name,
      language: data.language,
      voiceHeardAs: data.voiceHeardAs,
      nonVerbal: meetingInfo.participants?.[0].nonVerbal,
      hearingImpaired: meetingInfo.participants?.[0].hearingImpaired,
      email: meetingInfo.participants?.[0].email,
      meetingId: meetingInfo.meetingId,
      tenantId: meetingInfo.tenantId,
    };
    useMeetingStore.setState({ meetingInfo: { ...meetingInfo, participants: [{ ...meetingPayload }] } });
    

    await handleUpdateGuestMeeting(meetingPayload);

    getGuestLoginInfo(meetingInfo.participants?.[0].email)

    setTimeout(() => {
      router.push(`/lobby`);
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6 p-4">
        <div className="w-full space-y-8 text-lg text-gray-900 sm:text-lg md:grid md:grid-cols-2 md:gap-2 dark:text-white/90">
          <div>
            <Label className="font-bold">Agenda</Label>
          </div>
          <div>{meetingInfo?.agenda}</div>

          <div>
            <Label className="font-bold">Email Id</Label>
          </div>
          <div>{meetingInfo?.participants?.[0].email}</div>
        </div>
       
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Participant Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select defaultValue="" {...field} onValueChange={field.onChange}>
                    <SelectTrigger id="participantLanguage" className="w-full">
                      <SelectValue placeholder="Preferred Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(languagesMap).map((languageCode) => (
                        <SelectItem key={languageCode} value={languageCode}>
                          {languagesMap[languageCode]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voiceHeardAs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Want to be heard as</FormLabel>
                <FormControl>
                  <RadioGroup orientation="horizontal" {...field} onValueChange={field.onChange}>
                    <RadioGroupItem value="male" id="male" label="He" disabled={!hasMaleVoiceParticipant} />
                    <RadioGroupItem value="female" id="female" label="She" disabled={!hasFemaleVoiceParticipant} />
                  </RadioGroup>
                </FormControl>
                <FormMessage />
                <div className="text-red-500">
                  {hasMaleVoiceParticipant && !hasFemaleVoiceParticipant && "Only male voice available"}
                  {hasFemaleVoiceParticipant && !hasMaleVoiceParticipant && "Only female voice available"}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nonVerbal"
            render={({ field }) => (
              <FormItem>
                <div className="mt-5 flex items-center gap-3">
                  <FormLabel>Non Verbal </FormLabel>
                  <FormControl>
                    <Checkbox id="nonVerbal" onCheckedChange={field.onChange} checked={field.value} ref={field.ref} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hearingImpaired"
            render={({ field }) => (
              <FormItem>
                <div className="mt-5 flex items-center gap-3">
                  <FormLabel>Hearing Impaired</FormLabel>
                  <FormControl>
                    <Checkbox
                      id="hearingImpaired"
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      ref={field.ref}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-15 w-full" type="submit" disabled={meetingInfo?.status !== "ONGOING"}>
          Join Meeting
        </Button>
      </form>
    </Form>
  );
};

export { GuestMeetingForm };
