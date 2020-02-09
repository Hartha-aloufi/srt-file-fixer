import Subtitle from 'subtitle';

class SrtFile {
    constructor(name, fileContent, size) {
        this.name = name;
        this.content = fileContent;
        this.originalSubs = Subtitle.parse(fileContent);
        this.size = size;
        
        // counts
        this.timeErrorsCount = 0;
        this.lineErrorsCount = 0;
        this.wordsCount = 0;
        this.charsCount = 0;
    }

    /**
     * main analyze function thats run asynchronouslly
     */
    async Analyze() {

    }
    
    AnalyzeSingleSub = (subtitle) => {
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

    EstimateTime = (charsCount) => {
        return Math.min(
            Math.max(
                charsCount / constants.AVARAGE_READ_SPEED * 1000,
                constants.MIN_SUB_DURATION
            ),
            constants.MAX_SUB_DURATION
        )
    }

    FixSubtitleEndTime = (sub, maxTime) => {
        maxTime = maxTime - 300;
        let endTime = estimateTime(sub.charsCount) + sub.start;

        endTime = Math.min(maxTime, endTime);

        return {
            ...sub,
            end: parseInt(endTime)
        }
    }

    CompineTowSubs = (sub1, sub2) => {
        return {
            text: `${sub1.text}\n${sub2.text}`,
            start: sub1.start,
            end: sub2.end,
        }
    }

}

export default SrtFile;