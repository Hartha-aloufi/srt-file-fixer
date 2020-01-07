
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

    let wordsCount = 1, charCount = 0;

    for(let i = 0; i < subtitle.length; i++) {
        const ch = subtitle.charAt(i);
        const prevCh = subtitle.charAt(i);
        if(isNumber(ch) || isLetter(ch)) {
            charCount++;
        }
        else if(isNumber(prevCh) || isLetter(prevCh)) {
            wordsCount++;
        }
    }

    return {wordsCount, charCount};
}

/***
 * احسب علاامتا الترقيم
 */

/**
 * 1569 - 1594 [ء - غ]
 * 1601 - 1610 [ف - ي]
 */
export const isLetter = (ch) => {
    const ascii = ch.charCodeAt(0);

    if(ascii >= 1569 && ascii <= 1594)
        return true;
    if(ascii >= 1601 && ascii <= 1610)
        return true;

    return false;
} 

/**
 * 1632 - 1641 [٩ - ٠] 
 * 48 - 57 [0 - 9]  
 */
export const isNumber = () => {
    ch.charCodeAt(0);

    if(ascii >= 1632 && ascii <= 1641)
        return true;
    if(ascii >= 1601 && ascii <= 1610)
        return true;

    return false;
}