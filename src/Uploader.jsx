import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import { NotificationManager } from 'react-notifications';
import uuid from 'uuid';

const Uploader = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        props.onDragLeave();
        
        acceptedFiles.forEach((file) => {
            props.onDrop({name: file.name, size : file.size, id: uuid()})

            const reader = new FileReader();

            reader.onerror = () => {
                NotificationManager.error(`Faild to Upload ${file.name}`);
            }

            reader.onload = () => {
                props.onLoadFile(file)
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