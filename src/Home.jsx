import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Uploader from './Uploader';
import FileCard from './FileCard';
import RighutMenu from './RightMenu';

import classnames from 'classnames';
import * as Subtitle from 'subtitle'

const Home = (props) => {
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);

    const worker = useRef(new Worker('./ParserWorker.js'));

    useEffect(() => {
        worker.current.addEventListener('message', (data) => {
            alert('hi')
        })
    }, []);

    useEffect(() => {
        worker.current.onmessage = evt => {
            alert(evt.data)
        }

    }, [worker]);

    const dropFileHandler = useCallback(
        (file) => {
            setFiles(prevFiles => (
                [...prevFiles, file]
            ));
        }, [files]
    );

    const fileLoadHandler = useCallback(
        (fileText) => {

        }, []
    );

    const dragOverHandler = useCallback(
        () => {
            setDragging(true)
        }, []
    );

    const dragLeaveHandler = useCallback(
        () => {
            console.log('drag leave')
            setDragging(false)
        }, []
    );

    return (
        <main className="main">
            {worker.current.postMessage({ type: 'main thread', payload: 'Hello hartha' })}

            <section className="work-area">
                <Uploader
                    onDrop={dropFileHandler}
                    onLoadFile={fileLoadHandler}
                    onDragOver={dragOverHandler}
                    onDragLeave={dragLeaveHandler}
                >
                    <div className="files-grid">
                        {
                            useMemo(
                                () => {
                                    return files.map(file => (
                                        <FileCard name={file.name} errors={file.errors} />
                                    ))
                                }, [files]
                            )
                        }
                    </div>

                    <div className={classnames("overlay", { hide: !dragging })}>
                        <p className="overlay__msg">Drop it like it's hot!</p>
                    </div>
                </Uploader>


            </section>

            <RighutMenu />
        </main>
    )
}

export default Home;