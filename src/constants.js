export let AVARAGE_READ_SPEED = 17;
export let MAX_SUB_DURATION = 7 * 1e3;
export let MIN_SUB_DURATION = 1 * 1e3;
export const ERROR_THRESHOLD = 100; // in ms
export const tashkeel = ['ُ', 'َ', 'ِ', 'ْ', 'ّ', 'ً', 'ٌ', 'ٍ']
export const tarqeem = ['،', '؛', '؟', '!', '.', ':', '-', '(', ')', '»', '«', '/']

export const setValues = (values) => {
    AVARAGE_READ_SPEED = values.avarageSpeed;
    MAX_SUB_DURATION = values.maxDuration * 1e3;
    MIN_SUB_DURATION = values.minDuration * 1e3;
}