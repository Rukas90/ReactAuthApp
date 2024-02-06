declare global {
    export type LocalizedTextID = { value: string; _type: 'LocalizedTextID' };
    export type LocalizableText = LocalizedTextID | string

    export type TranslationOptions = Record<string, any>

    export function Localized(text: string): LocalizedTextID
    export function Translate(id: LocalizableText | string, options?: TranslationOptions): string
}
  
export {};