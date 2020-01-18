import React, { useState, useCallback, useMemo, useReducer, useEffect, useRef } from "react";
import Header from './Header'
import Uploader from "./Uploader";
import FileCard from "./FileCard";
import RighutMenu from "./RightMenu";
import { Spin } from 'antd'

import * as Subtitle from "subtitle";
import * as constants from './constants.js';
import { updateSingleArrayState, analyizeSubtitle, fixSubtitleEndTime, replaceNewLines, compineTowSubs, compineSubWithHardErrors }
  from "./utils";
import classnames from "classnames";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const initSettingsState = {
  maxDuration: constants.MAX_SUB_DURATION * 0.001,
  minDuration: constants.MIN_SUB_DURATION * 0.001,
  avarageSpeed: constants.AVARAGE_READ_SPEED,
}

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'max-duration':
      return { ...state, maxDuration: action.val };
    case 'min-duration':
      return { ...state, minDuration: action.val };
    case 'avarage-speed':
      return { ...state, avarageSpeed: action.val };

    default:
      return state;
  }
}
const Home = props => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixCount, setFixCount] = useState(0);
  const [settings, dispatch] = useReducer(settingsReducer, initSettingsState);
  const [girdColumns, setGridColumns] = useState(3)
  const gridRef = useRef();

  const dropFileHandler = useCallback(
    file => {
      setFiles(prevFiles => [...prevFiles, file]);
    },
    [files]
  );

  useEffect(() => {
    // hack
    // to do it later
    constants.setValues(settings);

  }, [settings]);

  useEffect(() => {
    if (!gridRef.current)
      return;

    setGridColumns(parseInt(gridRef.current.offsetWidth / 270));
  }, [gridRef.current]);

  const fileLoadHandler = useCallback(
    (fileID, fileContent) => {
      let parsedSub = Subtitle.parse(fileContent);
      // to be done in better way
      const hardErrors = [];

      // analize each sub object
      let w = 0,
        c = 0,
        timeErrors = 0,
        lineErrors = 0;

      parsedSub = parsedSub.filter((sub, idx, subs) => {
        if (sub.text.endsWith('###')) {
          sub.text = sub.text.replace('###', '')
          parsedSub[idx + 1] = compineTowSubs(sub, subs[idx + 1]);
          return false;
        }

        return true;
      })

      parsedSub.forEach((sub, subIdx) => {
        const { wordsCount, charsCount, estimateTime, linesCount, firstLineChars } =
          analyizeSubtitle(sub.text);

        // custome action
        sub.text = replaceNewLines(sub.text);

        sub.charsCount = charsCount;
        sub.estimateTime = estimateTime;

        w += wordsCount;
        c += charsCount;
        if (Math.abs((estimateTime + sub.start) - sub.end) > constants.ERROR_THRESHOLD) {
          timeErrors++;
        }

        // all line errors are hard; conn't fixed automaticlly
        if (linesCount === 1) {
          if (charsCount > 42) {
            lineErrors++;
            // to be done in better way
            if(!hardErrors[subIdx + 1]) hardErrors[subIdx + 1] = []
            hardErrors[subIdx + 1].push('عدد الاحرف اكبر من 42')
          }
        } else if (linesCount === 2) {
          const secondLineCharsCount = charsCount - firstLineChars;

          if (firstLineChars / secondLineCharsCount > .489) {
            lineErrors++;
            if(!hardErrors[subIdx + 1]) hardErrors[subIdx + 1] = []
            hardErrors[subIdx + 1].push('عدد الاحرف في السطر الثاني اقل من نصفها في السطر الاول')
          }
        } else {
          lineErrors++;

          if(!hardErrors[subIdx + 1]) hardErrors[subIdx + 1] = []
          hardErrors[subIdx + 1].push('عدد الاسطر اكثر من ثلاثة')
        }
      });

      setFiles(prevFiles => {
        return updateSingleArrayState(
          fileID,
          { parsedSub, wordsCount: w, charsCount: c, timeErrors, lineErrors, hardErrors },
          prevFiles
        );
      });
    },
    [files]
  );

  const fileLoadProgressHandler = useCallback(
    (fileID, progress) => {
      setFiles(prevFiles => {
        return updateSingleArrayState(fileID, { progress }, prevFiles);
      });
    },
    [files]
  );

  const dragOverHandler = useCallback(() => {
    setDragging(true);
  }, []);

  const dragLeaveHandler = useCallback(() => {
    setDragging(false);
  }, []);

  const fixClickHandler = useCallback(() => {
    const newFiles = [];

    files.forEach((file) => {
      const { parsedSub, hardErrors } = file;
      const newParsedSub = [];
      let timeErrors = 0;

      parsedSub.forEach((sub, idx) => {
        const nextEndtime = parsedSub[idx + 1] ? parsedSub[idx + 1].start : 1e9;
        const fixedSub = fixSubtitleEndTime(sub, nextEndtime)

        newParsedSub.push(fixedSub);

        if (Math.abs(fixedSub.end - sub.start - sub.estimateTime) > constants.ERROR_THRESHOLD) {
          if(!hardErrors[idx + 1]) hardErrors[idx + 1] = []
          hardErrors[idx + 1].push('مدة عرض الترجمة غير مناسب, وقت بداية التارجمة التالية قريب جدا');
          timeErrors++;
        }
      })

      newFiles.push({ ...file, fixedSub: newParsedSub, timeErrors });
    })

    setFiles(newFiles);

    downloadFilesHandler(newFiles);

    setFixCount(fixCount + 1)

  }, [files])

  const removeFileHandler = useCallback(
    (id) => {
      setFiles(files.filter(f => f.id !== id))
    }, [files]
  )

  const downloadFilesHandler = useCallback(
    (files) => {
      const zip = new JSZip();

      files.forEach((file, idx) => {
        const { fixedSub, hardErrors } = file;
        // to bo done in better way
        const finalSub = compineSubWithHardErrors(fixedSub, hardErrors)

        const srtString = Subtitle.stringify(finalSub);
        zip.file(`fixed-${file.name}`, srtString);
      })

      // generate zip file
      zip.generateAsync({ type: 'blob' }).then((content) => {
        // download files
        saveAs(content, "fixed-srt-files.zip");
        setFixing(false);
      });
    }, [files])


    
  const filesCard = useMemo(() => {
    return files.map(file => (
      <FileCard
        id={file.id}
        name={file.name}
        size={file.size}
        wordsCount={file.wordsCount}
        charsCount={file.charsCount}
        timeErrors={file.timeErrors}
        lineErrors={file.lineErrors}
        progress={file.progress}
        onRemoveClicked={removeFileHandler}
      />
    ));
  }, [files])

  return (
    <>
      <Header
        settings={settings}
        dispatch={dispatch}
      />

      <Spin spinning={fixing}>
        <main className="main">
          <section className="work-area">
            <Uploader
              onDrop={dropFileHandler}
              onLoadFile={fileLoadHandler}
              onLoadProgress={fileLoadProgressHandler}
              onDragOver={dragOverHandler}
              onDragLeave={dragLeaveHandler}
            >
              <div ref={gridRef} className="files-grid"
                style={{
                  gridTemplateColumns: `repeat(${girdColumns}, 1fr)`
                }}
              >
                {filesCard}
              </div>

              {
                !files.length &&
                <h2 className="empty-msg">Drop STR Files Here To Fix</h2>
              }

              <div className={classnames("overlay", { hide: !dragging })}>
                <p className="overlay__msg">Drop it like it's hot!</p>
              </div>
            </Uploader>
          </section>

          <RighutMenu
            onFix={() => {
              setFixing(true);
              setTimeout(() => fixClickHandler(), 0)
            }}
            disableFixBtn={files.length === 0}
            refix={fixCount !== 0}
          />
        </main>
      </Spin>
    </>
  );
};

export default Home;
