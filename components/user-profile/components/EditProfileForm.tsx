"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countries } from "@/constants/countries";
import * as flagIcons from 'country-flag-icons/string/3x2'
import { PhoneInput } from "react-international-phone";
import "@/styles/react-international-phone.css";
import { ProfileUpdateSchema } from "./schema";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";
import { Checkbox } from "@/components/ui/checkbox";
import SVG from 'react-inlinesvg';
import { watch } from "fs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languagesMap } from "@/constants/languages";
import { getVoiceFromLanguageCode } from "@/constants/voiceMap";
import { toast } from "sonner";

const EditProfileForm = ({ onSuccess }) => {
  const userData = useUserStore().getUserData();
  const {
    id,
    firstName,
    lastName,
    phoneNumber,
    address,
    city,
    state,
    postalCode,
    country,
    nonVerbal,
    hearingImpaired,
    preferredLanguage,
    spokenInVoice,
  } = userData;
  const { isPending, mutateAsync: handleUpdateProfile, isSuccess, data } = useUpdateUserProfile();
  const [hasMaleVoiceParticipant, setHasMaleVoiceParticipant] = useState(false);
  const [hasFemaleVoiceParticipant, setHasFemaleVoiceParticipant] = useState(false);

  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      id,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      postalCode,
      country,
      nonVerbal,
      hearingImpaired,
      preferredLanguage,
      spokenInVoice,
    },
  });

  useEffect(() => {
    form.setValue("spokenInVoice", "");
    const language = form.watch("preferredLanguage");
    const voices = getVoiceFromLanguageCode(language);
    
    setHasMaleVoiceParticipant(Boolean(voices?.male));
    setHasFemaleVoiceParticipant(Boolean(voices?.female));
  }, [form.watch("preferredLanguage")]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  const onSubmit = async (data: z.infer<typeof ProfileUpdateSchema>) => {
    const userData = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      nonVerbal: data.nonVerbal,
      hearingImpaired: data.hearingImpaired,
      preferredLanguage: data.preferredLanguage,
      spokenInVoice: data.spokenInVoice
    }
    await handleUpdateProfile(userData);

  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="md:grid md:grid-cols-2 md:gap-3">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input id="id" type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input id="firstName" type="text" placeholder="First Name" autoComplete="firstName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input id="lastName" type="text" placeholder="Last Name" autoComplete="lastName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="preferredLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select defaultValue="" {...field} onValueChange={field.onChange}>
                      <SelectTrigger id="preferredLanguage" className="w-full">
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
              name="spokenInVoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Want to be heard as</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                    <RadioGroup orientation="horizontal" {...field} onValueChange={field.onChange}>
                      <RadioGroupItem value="male" id="male" label="He" disabled={!hasMaleVoiceParticipant} />
                      <RadioGroupItem value="female" id="female" label="She" disabled={!hasFemaleVoiceParticipant} />
                    </RadioGroup>
                    <div className="text-red-500">
                    {hasMaleVoiceParticipant && !hasFemaleVoiceParticipant && "Only male voice available"}
                    {hasFemaleVoiceParticipant && !hasMaleVoiceParticipant && "Only female voice available"}
                  </div>
                  </div>
                  </FormControl>
                  <FormMessage />
                  
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-3">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="Enter a phone number"
                      {...field}
                      defaultCountry="us"
                      inputClassName={cn(
                        "w-full rounded-lg border appearance-none px-4 py-2.5 text-base shadow-theme-md placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
                        "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800",
                        "aria-invalid:ring-error-500/20 dark:aria-invalid:ring-error-500/40 aria-invalid:border-error-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Select defaultValue="" id="country" {...field} onValueChange={field.onChange}>
                      <SelectTrigger id="country" className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(({ emoji, iso2, name }) => (
                          <SelectItem key={iso2} value={iso2}>
                            <SVG src={flagIcons[iso2]} />
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-3">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input id="address" placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input id="city" placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input id="state" placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code *</FormLabel>
                  <FormControl>
                    <Input id="postalCode" placeholder="Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nonVerbal"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3 mt-5">
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
                  <div className="flex items-center gap-3 mt-5">
                    <FormLabel>Hearing Impaired</FormLabel>
                    <FormControl>
                      <Checkbox id="hearingImpaired" onCheckedChange={field.onChange}  checked={field.value} ref={field.ref} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="mt-10 w-full" type="submit">
            Update
          </Button>
        </form>
      </Form>
    </>
  );
};

export { EditProfileForm };
