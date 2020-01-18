import * as constants from './constants';

export const parseTime = (time) => {
    const timeArr = [];
    for (let i = 0; i < time.length; i += 3) {
        timeArr.push(parseInt(time.charAt(i) + '' + time.charAt(i + 1)));

        if (i === 9)
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
    if (!subtitle)
        throw new Error('subtitle is empty or null');

    let wordsCount = 0, charsCount = 0, linesCount = 1, firstLineChars = 0;
    let cntLetters = 0;

    for (let i = 0; i < subtitle.length; i++) {
        const ch = subtitle.charAt(i);

        // to do in better way
        
        // don't count the tashkeels
        if (isTashkeela(ch))
            continue;
        //dont count new lines as a charachter
        else if (ch === '\n' || ch === '#') {
            linesCount++;
            firstLineChars = charsCount;
        }

        charsCount++;

        if (isLetter(ch))
            cntLetters++
        else if (cntLetters) {
            wordsCount++;
            cntLetters = 0;
        }
    }

    cntLetters && wordsCount++;


    return {
        wordsCount,
        charsCount,
        estimateTime: estimateTime(charsCount),
        linesCount,
        firstLineChars
    };
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

    if (ascii >= 1569 && ascii <= 1594)
        return true;
    if (ascii >= 1601 && ascii <= 1610)
        return true;
    if (ascii >= 65 && ascii <= 90)
        return true;
    if (ascii >= 97 && ascii <= 122)
        return true;

    return false;
}

/**
 * 1632 - 1641 [٩ - ٠] 
 * 48 - 57 [0 - 9]  
 */
export const isNumber = (ch) => {
    const ascii = ch.charCodeAt(0);

    if (ascii >= 1632 && ascii <= 1641)
        return true;
    if (ascii >= 1601 && ascii <= 1610)
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
    return Math.min(
        Math.max(
            charsCount / constants.AVARAGE_READ_SPEED * 1000,
            constants.MIN_SUB_DURATION
        ),
        constants.MAX_SUB_DURATION
    )
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

export const compineTowSubs = (sub1, sub2) => {
    return {
        text: `${sub1.text}\n${sub2.text}`,
        start: sub1.start,
        end: sub2.end,
    }
}


export const updateSingleArrayState = (elemID, newData, arrState) => {
    const updatedArr = arrState.map(elm => {
        if (elm.id === elemID)
            return { ...elm, ...newData }

        return elm;
    });

    return updatedArr;
}

export const replaceNewLines = (subText) => {
    return subText.replace('#', '\n');
}

export const stringifyHardErrors = (errors) => {
    const arr = errors.reduce((prev = '', cur, idx) => {

    })
} 

export const compineSubWithHardErrors = (sub, hardErrors) => {
    const finalSub = []

    sub.forEach((s, idx) => {
        let text = s.text;
        if(hardErrors[idx+1]) {
            text += `\n\n***"${hardErrors[idx+1].toString()}"`
        }        

        finalSub.push({...s, text})
    });

    return finalSub
}