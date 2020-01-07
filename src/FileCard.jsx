import React from 'react';
import { Icon } from 'antd';

const FileCard = (props) => {
    return <div className="file-card">
        <div className="file-card__header">
            <Icon className="file-card__close" type="close-circle" onClick={props.onRemoveClicked} />
        </div>

        <div className="file-card__body">
            {
                props.errors &&
                <>
                    <Icon className="file-card__file-icon file-card__file-icon--success" type="file-exclamation" />
                    <span className="file-card__status">This File has {props.errors} errors.</span>
                </>
            }

            {
                props.errors &&
                <>
                    <Icon className="file-card__file-icon file-card__file-icon--error" type="file-done" />
                    <span className="file-card__status">File is Perfect</span>
                </>
            }

        </div>

        <div className="file-card__footer">
            <span className="file-card__name">
                {props.name}
            </span>
        </div>
    </div>
}

export default FileCard;