import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/form'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { guestMeetingSchema } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { getVoiceFromLanguageCode } from '@/constants/voiceMap'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { awsStreamingLanguages, ibmStreamingLanguages } from '@/constants/languages'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const GuestMeetingForm = () => {
    const [hasMaleVoiceParticipant, setHasMaleVoiceParticipant] = useState(false);
    const [hasFemaleVoiceParticipant, setHasFemaleVoiceParticipant] = useState(false);
    const form = useForm<z.infer<typeof guestMeetingSchema>>({
        resolver: zodResolver(guestMeetingSchema),
        defaultValues: {
            participantLanguage: "",
            participantAudioHeardAs: ""
        }
    })
    useEffect(() => {
        const language = form.watch("participantLanguage")
        const voices = getVoiceFromLanguageCode(language);

        setHasMaleVoiceParticipant(Boolean(voices?.male));
        setHasFemaleVoiceParticipant(Boolean(voices?.female));

    }, [form.watch("participantLanguage")]);

    const handleSubmit = (data: z.infer<typeof guestMeetingSchema>) => {
        console.log('Meeting data:', data);
    };
    const languagesMap = {
        ...awsStreamingLanguages,
        ...ibmStreamingLanguages,
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6 p-4">
                <div className="w-full space-y-8 text-lg text-gray-900 sm:text-lg md:grid md:grid-cols-2 md:gap-2 dark:text-white/90">
                    <div>
                        <Label className="font-bold">Agenda</Label>
                    </div>
                    <div>Test Call</div>
                    <div>
                        <Label className="font-bold">Name</Label>
                    </div>
                    <div>John Doe</div>
                    <div>
                        <Label className="font-bold">Email Id</Label>
                    </div>
                    <div>johndoe@gmail.com</div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-6">
                    <FormField
                        control={form.control}
                        name="participantLanguage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Language</FormLabel>
                                <FormControl>
                                    <Select defaultValue=""  {...field} onValueChange={field.onChange}>
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
                        name="participantAudioHeardAs"
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
                                    {hasFemaleVoiceParticipant &&
                                        !hasMaleVoiceParticipant &&
                                        "Only female voice available"}
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <Button className="w-full mt-15" type="submit">Join Meeting</Button>
            </form>
        </Form>
    )
}

export { GuestMeetingForm }