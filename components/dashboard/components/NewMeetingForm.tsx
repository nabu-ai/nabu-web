import z from "zod";

import { newMeetingSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languagesMap } from "@/constants/languages";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { getVoiceFromLanguageCode } from "@/constants/voiceMap";
import { useNewMeeting } from "../hooks/useNewMeeting";
import { useUserStore } from "@/store/useUserStore";

type NewMeetingFormProps = {
  onSubmit: () => void;
};
const NewMeetingForm = ({ onSubmit }: NewMeetingFormProps) => {
    const userData = useUserStore().getUserData();
  const [hasMaleVoice, setHasMaleVoice] = useState(false);
  const [hasFemaleVoice, setHasFemaleVoice] = useState(false);
    const {mutateAsync: handleCreateMeeting, isSuccess} = useNewMeeting()

  const form = useForm<z.infer<typeof newMeetingSchema>>({
    resolver: zodResolver(newMeetingSchema),
    defaultValues: {
      agenda: "",
      hostLanguage: userData.preferredLanguage,
      hostHeardAs: userData.spokenInVoice,
      participantName: "",
      participantEmail: "",
    },
  });
  useEffect(() => {
    const language = form.watch("hostLanguage");
    const voices = getVoiceFromLanguageCode(language);
    setHasMaleVoice(voices?.male);
    setHasFemaleVoice(voices?.female);
  }, [form.watch("hostLanguage")]);

  const handleSubmit = async (data: z.infer<typeof newMeetingSchema>) => {
    console.log("Meeting data:", data);
    const meetingPayload = {
      agenda: data.agenda,
      hostLanguage: data.hostLanguage,
      hostHeardAs: data.hostHeardAs,
      participants: [
        {
          email: data.participantEmail,
          name: data.participantName,
        },
      ],
    };
    await handleCreateMeeting(meetingPayload);
    onSubmit()
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6 p-4">
        <FormField
          control={form.control}
          name="agenda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agenda</FormLabel>
              <FormControl>
                <Input placeholder="Meeting Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="hostLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger id="language" className="w-full">
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
          <div>
            <FormField
              control={form.control}
              name="hostHeardAs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio Heard As</FormLabel>
                  <FormControl>
                    <RadioGroup orientation="horizontal" {...field} onValueChange={field.onChange}>
                      <RadioGroupItem value="male" id="male" label="He" disabled={!hasMaleVoice} />
                      <RadioGroupItem value="female" id="female" label="She" disabled={!hasFemaleVoice} />
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-red-500">
              {hasMaleVoice && !hasFemaleVoice && "Only male voice available"}
              {hasFemaleVoice && !hasMaleVoice && "Only female voice available"}
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="participantName"
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
        <FormField
          control={form.control}
          name="participantEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paticipant Email</FormLabel>
              <FormControl>
                <Input placeholder="Participant Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4 w-full" type="submit">
          Create Meeting
        </Button>
      </form>
    </Form>
  );
};

export default NewMeetingForm;
