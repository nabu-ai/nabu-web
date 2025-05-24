const languageToVoiceMapAWS = {
  arb: { female: "Zeina" },
  "ar-AE": { female: "Hala", male: "Zayd" },
  "ca-ES": { female: "Arlet" },
  "cs-CZ": { female: "Jitka" },
  "cy-GB": { female: "Gwyneth" },
  "da-DK": { female: "Sofie", male: "Mads" },
  "de-AT": { female: "Hannah" },
  "de-CH": { female: "Sabrina" },
  "de-DE": { female: "Vicki", male: "Daniel" },
  "en-AU": { female: "Olivia", male: "Russell" },
  "en-GB": { female: "Amy", male: "Brian" },
  "en-GB-WLS": { male: "Geraint" },
  "en-IN": { female: "Kajal" },
  "en-IE": { female: "Niamh" },
  "en-NZ": { female: "Aria" },
  "en-SG": { female: "Jasmine" },
  "en-US": { female: "Joanna", male: "Matthew" },
  "en-ZA": { female: "Ayanda" },
  "es-ES": { female: "Lucia", male: "Sergio" },
  "es-MX": { female: "Mia", male: "Andrés" },
  "es-US": { female: "Lupe", male: "Pedro" },
  "fi-FI": { female: "Suvi" },
  "fr-BE": { female: "Isabelle" },
  "fr-CA": { female: "Gabrielle", male: "Liam" },
  "fr-FR": { female: "Léa", male: "Rémi" },
  "hi-IN": { female: "Kajal" },
  "is-IS": { female: "Dóra", male: "Karl" },
  "it-IT": { female: "Bianca", male: "Adriano" },
  "ja-JP": { female: "Kazuha", male: "Takumi" },
  "ko-KR": { female: "Seoyeon" },
  "nb-NO": { female: "Ida" },
  "nl-BE": { female: "Lisa" },
  "nl-NL": { female: "Laura", male: "Ruben" },
  "pl-PL": { female: "Ola", male: "Jacek" },
  "pt-BR": { female: "Camila", male: "Thiago" },
  "pt-PT": { female: "Inês", male: "Cristiano" },
  "ro-RO": { female: "Carmen" },
  "ru-RU": { female: "Tatyana", male: "Maxim" },
  "sv-SE": { female: "Elin" },
  "tr-TR": { female: "Burcu" },
  "yue-CN": { female: "Hiujin" },
  "cmn-CN": { female: "Zhiyu" },
};
// Map language codes to IBM Watson voices
const languageToVoiceMapIBM = {
  "en-US": {
    male: "en-US_HenryV3Voice",
    female: "en-US_AllisonV3Voice",
  },
  "en-GB": {
    male: "en-GB_JamesV3Voice",
    female: "en-GB_KateV3Voice",
  },
  "en-AU": {
    male: "en-AU_JackExpressive",
    female: "en-AU_HeidiExpressive",
  },

  // 'en-AU': 'en-AU_CraigV3Voice',
  // 'en-NZ': 'en-NZ_OliviaV3Voice',
  "es-ES": {
    male: "es-ES_EnriqueV3Voice",
    female: "es-ES_LauraV3Voice",
  },
  "es-LA": {
    female: "es-LA_SofiaV3Voice",
  },
  "es-US": {
    female: "es-US_SofiaV3Voice",
  },
  "fr-FR": {
    male: "fr-FR_NicolasV3Voice",
    female: "fr-FR_ReneeV3Voice",
  },
  "fr-CA": {
    female: "fr-CA_LouiseV3Voice",
  },
  "de-DE": {
    male: "de-DE_DieterV3Voice",
    female: "de-DE_BirgitV3Voice",
  },
  "it-IT": {
    female: "it-IT_FrancescaV3Voice",
  },
  "pt-BR": {
    male: "pt-BR_LucasExpressive",
    female: "pt-BR_IsabelaV3Voice",
  },
  "ja-JP": {
    female: "ja-JP_EmiV3Voice",
  },
  //'nl-NL': 'nl-NL_LiamV3Voice',
  //'ko-KR': 'ko-KR_YoungmiV3Voice',
  "ko-KR": {
    female: "ko-KR_JinV3Voice",
  },
  // 'zh-CN': 'zh-CN_LiNaV3Voice',
  // Add more languages and voices as needed
};

export function getVoiceFromLanguageCode(languageCode, gender = null) {
  let voices = languageToVoiceMapIBM[languageCode];
  if (!voices) {
    voices = languageToVoiceMapAWS[languageCode];
  }
  if (!voices) return null;

  if (!gender) return voices;

  const requested = voices[gender.toLowerCase()];
  if (requested) return requested;

  // fallback to the other gender
  const fallback = voices["male"] || voices["female"];
  return fallback || null;
}
