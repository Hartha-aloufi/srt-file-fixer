import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import { NotificationManager } from 'react-notifications';
import uuid from 'uuid';

const Uploader = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        props.onDragLeave();
        
        acceptedFiles.forEach((file) => {
            const id = uuid();
            props.onDrop({name: file.name, size : file.size, id})

            const reader = new FileReader();

            reader.onerror = () => {
                NotificationManager.error(`Faild to Upload ${file.name}`);
            }

            reader.onload = () => {
                props.onLoadFile(id, reader.result)
            }

            reader.onprogress = (evt) => {
                props.onLoadProgress(id, evt.loaded / evt.total)
            }

            reader.readAsText(file);    
        })
    }, []);

    const onDragEnter = useCallback(
        () => {
            props.onDragOver();
        }, []
    );
    
    const onDragLeave = useCallback(
        () => {
            props.onDragLeave();
        }, []
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop, onDragLeave, onDragEnter})

    return (
        <div className="drop-zone" {...getRootProps()}>
            <input {...getInputProps({
                // disable opening file dialog on click
                onClick: event => event.preventDefault()
            })} />
            {props.children}
        </div>
    )
}


export default Uploader;