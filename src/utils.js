import * as constants from './constants';

export const parseTime = (time) => {
    const timeArr = [];
    for(let i = 0; i < time.length; i+= 3) {
        timeArr.push(parseInt(time.charAt(i) + '' + time.charAt(i+1)));

        if(i === 9)
            timeArr[i / 3] += time.charAt(i + 3) + '';
    }
    return hourToMS(timeArr[0]) + minuteToMS(timeArr[1]) + secondToMS(timeArr[2]);

}

export const hourToMS = (hour) => {
    return hour * 3.6e+6;
}
export const minuteToMS = (minute) => {
    return minute * 6e4
}
export const secondToMS = (second) => {
    return second * 1e3;
}


export const analyizeSubtitle = (subtitle) => {
    if(!subtitle)
        throw new Error('subtitle is empty or null');

    let wordsCount = 0, charsCount = 0;
    let cntLetters = 0;

    for(let i = 0; i < subtitle.length; i++) {
        const ch = subtitle.charAt(i);

        // don't count the tashkeels
        if(isTashkeela(ch))
            continue;

        charsCount++;

        if(isLetter(ch))
            cntLetters++
        else if(cntLetters) {
            wordsCount++;
            cntLetters = 0; 
        }
    }

    cntLetters && wordsCount++;


    return {wordsCount, charsCount, estimateTime: estimateTime(charsCount)};
}

window.calc = analyizeSubtitle;

/***
 * احسب علاامتا الترقيم
 */

/**
 * 1569 - 1594 [ء - غ]
 * 1601 - 1610 [ف - ي]
 * 65- 90 [A- Z]
 * 97- 122 [A- Z]
 */
export const isLetter = (ch) => {
    const ascii = ch.charCodeAt(0);

    if(ascii >= 1569 && ascii <= 1594)
        return true;
    if(ascii >= 1601 && ascii <= 1610)
        return true;
    if(ascii >= 65 && ascii <= 90)
        return true;
    if(ascii >= 97 && ascii <= 122)
        return true;

    return false;
} 

/**
 * 1632 - 1641 [٩ - ٠] 
 * 48 - 57 [0 - 9]  
 */
export const isNumber = (ch) => {
    const ascii = ch.charCodeAt(0);

    if(ascii >= 1632 && ascii <= 1641)
        return true;
    if(ascii >= 1601 && ascii <= 1610)
        return true;

    return false;
}

/**
 * 1611 - 1618 ['ُ', 'َ', 'ِ', 'ْ', 'ّ', 'ً', 'ٌ', 'ٍ'] 
 */
export const isTashkeela = (ch) => {
    const ascii = ch.charCodeAt(0);

    return (ascii >= 1611 && ascii <= 1618)
}


const estimateTime = (charsCount) => {
    return charsCount / constants.AVARAGE_READ_SPEED * 1000
}

export const fixSubtitleEndTime = (sub, maxTime) => {
    maxTime = maxTime - 300;
    let endTime = estimateTime(sub.charsCount) + sub.start;

    endTime = Math.min(maxTime, endTime);

    return {
        ...sub,
        end: parseInt(endTime)
    }
}


export const updateSingleArrayState = (elemID, newData, arrState) => {
    const updatedArr = arrState.map(elm => {
        if(elm.id === elemID)
            return {...elm, ...newData}

        return elm;
    });

    return updatedArr;
}