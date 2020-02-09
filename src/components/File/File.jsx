import React from 'react';
import FileCard from '../FileCard/FileCard';
import { useEffect } from 'react';
import Subtitle, { parse } from 'subtitle';
import { useState } from 'react';
import { updateSingleArrayState, analyizeSubtitle, fixSubtitleEndTime, replaceNewLines, compineTowSubs, compineSubWithHardErrors }
    from "../../utils";

const File = props => {
    const [originalSubs, setOriginalSubs] = useState(null);
    //counts
    const [timeErrorsCount, setTimeErrorsCount] = useState(0);
    const [lineErrorsCount, setLineErrorsCount] = useState(0);
    const [wordsCount, setWordsCount] = useState(0);
    const [charsCount, setCharsCount] = useState(0);

    // did mount
    useEffect(() => {

    }, []);

    /**
     * parse the file and add unequ id to each sub
     * NOTE: the id is unequ on the single file level
     */
    useEffect(() => {
        setOriginalSubs(Subtitle.parse(props.content).map(sub => {
            sub.ID = generateID();
            return sub;
        }));
    }, [props.content])


    /**
     * analyze srt subs function taht's include:
     * 1- words count
     * 2- charachters count
     * 3- line errors count
     * 4- time errors count
     * 5- hard errors that we didn't handle it automaticlly
     */
    const analyze = useCallback(() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let w = 0,
                    c = 0,
                    timeErrors = 0,
                    lineErrors = 0;

                const hardErrors = [];
                const sbCounts = [];

                originalSubs.forEach((sub, subIdx) => {
                    const { wordsCount, charsCount, estimateTime, linesCount, firstLineChars } =
                        analyizeSubtitle(sub.text);

                    sbCounts[sub.ID] = {
                        charsCount,
                        estimateTime,
                        wordsCount,
                        lineErrors: false,
                        timeError: false
                    }

                    w += wordsCount;
                    c += charsCount;
                    if (Math.abs((estimateTime + sub.start) - sub.end) > constants.ERROR_THRESHOLD) {
                        timeErrors++;
                        sbCounts[sub.ID].timeError = true;
                    }

                    // all line errors are hard; conn't fixed automaticlly
                    if (linesCount === 1) {
                        if (charsCount > 42) {
                            lineErrors++;
                            // to be done in better way
                            if (!hardErrors[subIdx + 1]) hardErrors[subIdx + 1] = []
                            hardErrors[subIdx + 1].push('عدد الاحرف اكبر من 42')

                            sbCounts[sub.ID].lineErrors = true;
                        }
                    } else if (linesCount === 2) {
                        const secondLineCharsCount = charsCount - firstLineChars;

                        if (firstLineChars / secondLineCharsCount > .489) {
                            lineErrors++;
                            if (!hardErrors[subIdx + 1]) hardErrors[subIdx + 1] = []
                            hardErrors[subIdx + 1].push('عدد الاحرف في السطر الثاني اقل من نصفها في السطر الاول')

                            sbCounts[sub.ID].lineErrors = true;

                        }
                    } else {
                        lineErrors++;

                        if (!hardErrors[subIdx + 1]) hardErrors[subIdx + 1] = []
                        hardErrors[subIdx + 1].push('عدد الاسطر اكثر من ثلاثة')

                        sbCounts[sub.ID].lineErrors = true;
                    }

                    
                });

                setTimeErrorsCount(timeErrors);
                setLineErrorsCount(lineErrors);
                setWordsCount(w);
                setCharsCount(c)
            }, 0)
        })
    }, [originalSubs]);


    /**
     * a small utility to generate unque integers ID's
     * every time you call it it will return the cnt and increase it
     */
    const generateID = useCallback(function* _() {
        let cnt = 0;
        while (true) {
            yield cnt++;
        }
    }, []);

    return (
        <FileCard
            id={props.id}
            name={props.name}
            size={props.size}
            progress={props.progress}
            wordsCount={wordsCount}
            charsCount={charsCount}
            timeErrors={timeErrorsCount}
            lineErrors={lineErrorsCount}
            onRemoveClicked={props.onRemoveClicked}
        />
    )
}

export default File;