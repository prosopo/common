import { TFunction } from "i18next";
import translationEn from "./locales/en.json";

export function isClientSide(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

export type TFunctionParams = Parameters<TFunction>;

// https://medium.com/xgeeks/typescript-utility-keyof-nested-object-fa3e457ef2b2
// slightly modified since we only need string keys, number is there so IDE/Typescript doesn't complain
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

function getLeafFieldPath(obj: Object | string): string[] {
  if (typeof obj === "string") {
    return [obj];
  }

  return Object.keys(obj).reduce((arr, key) => {
    const children = getLeafFieldPath(obj[key]);

    return arr.concat(
      children.map((child) => {
        return `${key}.${child}`;
      })
    );
  }, [] as string[]);
}

export type TranslationKey = NestedKeyOf<typeof translationEn>;
export const translationKeys = getLeafFieldPath(translationEn) as TranslationKey[];
