import React from "react";
import { Icon } from "antd";
import classnames from "classnames";
import { Tooltip } from "antd";

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

const ErrorIcon = () => {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M37.6053 14.9467V12.0538C37.6053 11.7886 37.3883 11.5717 37.1231 11.5717H13.9803C13.7151 11.5717 13.4981 11.7886 13.4981 12.0538V14.9467C13.4981 15.2118 13.7151 15.4288 13.9803 15.4288H37.1231C37.3883 15.4288 37.6053 15.2118 37.6053 14.9467ZM13.9803 20.2502C13.7151 20.2502 13.4981 20.4672 13.4981 20.7324V23.6252C13.4981 23.8904 13.7151 24.1074 13.9803 24.1074H25.0695C25.3347 24.1074 25.5517 23.8904 25.5517 23.6252V20.7324C25.5517 20.4672 25.3347 20.2502 25.0695 20.2502H13.9803ZM36.641 27.2413C29.451 27.2413 23.6231 33.0692 23.6231 40.2592C23.6231 47.4491 29.451 53.277 36.641 53.277C43.8309 53.277 49.6588 47.4491 49.6588 40.2592C49.6588 33.0692 43.8309 27.2413 36.641 27.2413ZM43.1198 46.738C41.3901 48.4677 39.0879 49.4199 36.641 49.4199C34.1941 49.4199 31.8919 48.4677 30.1622 46.738C28.4325 45.0083 27.4803 42.706 27.4803 40.2592C27.4803 37.8123 28.4325 35.5101 30.1622 33.7804C31.8919 32.0507 34.1941 31.0985 36.641 31.0985C39.0879 31.0985 41.3901 32.0507 43.1198 33.7804C44.8495 35.5101 45.8017 37.8123 45.8017 40.2592C45.8017 42.706 44.8495 45.0083 43.1198 46.738ZM22.6588 47.4913H8.67669V5.06274H42.4267V25.7949C42.4267 26.0601 42.6437 26.277 42.9088 26.277H46.2838C46.549 26.277 46.766 26.0601 46.766 25.7949V2.65202C46.766 1.58528 45.9041 0.72345 44.8374 0.72345H6.26597C5.19923 0.72345 4.3374 1.58528 4.3374 2.65202V49.902C4.3374 50.9688 5.19923 51.8306 6.26597 51.8306H22.6588C22.924 51.8306 23.141 51.6136 23.141 51.3485V47.9735C23.141 47.7083 22.924 47.4913 22.6588 47.4913Z"
          fill="#CA1A1A"
        />
        <path
          d="M41.0617 43.7768L33.1925 35.9641L32.3181 36.6744L40.1873 44.4871L41.0617 43.7768Z"
          stroke="#CA1A1A"
          stroke-width="3.41971"
        />
        <path
          d="M33.2585 44.7174L40.8339 36.6108L40.1214 35.7337L32.546 43.8404L33.2585 44.7174Z"
          stroke="#CA1A1A"
          stroke-width="3.41971"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="54" height="54" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default FileCard;
