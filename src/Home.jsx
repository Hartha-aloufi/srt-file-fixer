import React, { useState, useCallback, useMemo } from "react";
import Uploader from "./Uploader";
import FileCard from "./FileCard";
import RighutMenu from "./RightMenu";
import { Spin } from 'antd'

import * as Subtitle from "subtitle";
import * as constants from './constants.js';
import { updateSingleArrayState, analyizeSubtitle, fixSubtitleEndTime } from "./utils";
import classnames from "classnames";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Home = props => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fixing, setFixing] = useState(false);

  const dropFileHandler = useCallback(
    file => {
      setFiles(prevFiles => [...prevFiles, file]);
    },
    [files]
  );

  const fileLoadHandler = useCallback(
    (fileID, fileContent) => {
      const parsedSub = Subtitle.parse(fileContent);

      // analize each sub object
      let w = 0,
        c = 0,
        errors = 0;

      parsedSub.forEach(sub => {
        const { wordsCount, charsCount, estimateTime } = analyizeSubtitle(sub.text);

        sub.charsCount = charsCount;
        sub.estimateTime = estimateTime;

        w += wordsCount;
        c += charsCount;
        if (Math.abs((estimateTime + sub.start) - sub.end) > constants.ERROR_THRESHOLD)
          errors++;
      });

      setFiles(prevFiles => {
        return updateSingleArrayState(
          fileID,
          { parsedSub, wordsCount: w, charsCount: c, errors },
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
      const { parsedSub } = file;
      const newParsedSub = [];
      let errors = 0;

      parsedSub.forEach((sub, idx) => {
        const nextEndtime = parsedSub[idx + 1] ? parsedSub[idx + 1].start : 1e9;
        const fixedSub = fixSubtitleEndTime(sub, nextEndtime)

        newParsedSub.push(fixedSub);

        if (Math.abs(fixedSub.end - sub.start - sub.estimateTime) > constants.ERROR_THRESHOLD)
          errors++;
      })

      newFiles.push({ ...file, parsedSub: newParsedSub, errors });
    })

    setFiles(newFiles);

    downloadFilesHandler(newFiles);

  }, [files])


  const downloadFilesHandler = useCallback(
    (files) => {
      const zip = new JSZip();

      files.forEach((file, idx) => {
        const { parsedSub } = file;
        const srtString = Subtitle.stringify(parsedSub);
        zip.file(`fixed-${file.name}`, srtString);
      })

      // generate zip file
      zip.generateAsync({ type: 'blob' }).then((content) => {
        // download files
        saveAs(content, "files.zip");
        setFixing(false);
      });
    }, [files])


    const deleteFileHandler = useCallback((fileID) => {
      
    });

  return (
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
            <div className="files-grid">
              {useMemo(() => {
                return files.map(file => (
                  <FileCard
                    name={file.name}
                    size={file.size}
                    wordsCount={file.wordsCount}
                    charsCount={file.charsCount}
                    errors={file.errors}
                    progress={file.progress}
                  />
                ));
              }, [files])}
            </div>

            <div className={classnames("overlay", { hide: !dragging })}>
              <p className="overlay__msg">Drop it like it's hot!</p>
            </div>
          </Uploader>
        </section>

        <RighutMenu onFix={() => {
          setFixing(true);
          setTimeout(() => fixClickHandler(), 0)
        }} />
      </main>
    </Spin>
  );
};

export default Home;
