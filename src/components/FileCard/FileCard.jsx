import React from "react";
import { Icon } from "antd";
import classnames from "classnames";
import { Tooltip } from "antd";
import ErrorIcon from './ErrorIcon';

const FileCard = props => {
  return (
    <Tooltip title={`${(props.size * 0.001).toFixed(1)} KB`}>
      <div className="file-card">
        <div className="file-card__header">
          <progress
            className={classnames("file-card__progress", {
              "fade-out": props.progress === 1
            })}
            max={1}
            value={props.progress}
          ></progress>
          <Icon
            title="delete file"
            className="file-card__close"
            type="close-circle"
            theme="filled"
            onClick={() => props.onRemoveClicked(props.id)}
          />
        </div>

        <div className="file-card__body">
          {!(props.timeErrors || props.lineErrors) && (
            <>
              <Icon
                className="file-card__file-icon file-card__file-icon--success"
                type="file-done"
              />
              <span className="file-card__status">File is Perfect</span>
            </>
          )}

          {(props.timeErrors || props.lineErrors) && (
            <>
              <Icon
                className="file-card__file-icon file-card__file-icon--error"
                component={ErrorIcon}
              />
              <span className="file-card__status">
                This File has {props.lineErrors + props.timeErrors} errors.
              </span>
            </>
          )}

          <ul className="file-card__details">
            <li className="file-card__details-item">
              <span>Characters Count: </span>
              <span>{props.charsCount}</span>
            </li>
            <li className="file-card__details-item">
              <span>Words Count: </span>
              <span>{props.wordsCount}</span>
            </li>
            <li className="file-card__details-item">
              <span>Time Errors: </span>
              <span>{props.timeErrors || 0}</span>
            </li>
            <li className="file-card__details-item">
              <span>Line Errors: </span>
              <span>{props.lineErrors || 0}</span>
            </li>
          </ul>
        </div>

        <div className="file-card__footer">
          <span className="file-card__name">{props.name}</span>
        </div>
      </div>
    </Tooltip>
  );
};
export default FileCard;
