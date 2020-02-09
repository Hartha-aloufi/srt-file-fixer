import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';

import { Modal, Slider, Icon, Tooltip } from 'antd';

const Settings = props => {
    const [showSettings, setShowSettings] = useState(false);
    const currSettings = useRef({ ...props.settings });

    const toggleSettings = useCallback(
        () => {
            currSettings.current = { ...props.settings }
            setShowSettings(!showSettings)
        }, [showSettings]
    );

    const cancelHandler = useCallback(
        () => {
            props.dispatch({ type: 'set-all', settings: currSettings.current });
            toggleSettings();

        }, [currSettings.current]
    )


    const maxMarker = useMemo(
        () => {
            return {
                3: '3s',
                10: '10s'
            };
        }, [props.settings]
    )
    const minMarker = useMemo(
        () => {
            return {
                1: '1s',
                [props.settings.maxDuration]: `${props.settings.maxDuration}s`
            };
        }, [props.settings]
    )
    const speedMarker = useMemo(
        () => {
            return {
                10: '10 characters/s',
                21: '21 characters/s'
            };
        }, [props.settings]
    )


    return (
        <>
            <Tooltip title={'Fix Settings'} placement="right">
                <Icon className="right-menu__settings-toggle" type="setting" onClick={toggleSettings} />
            </Tooltip>

            <Modal
                title="Fix Settings"
                visible={showSettings}
                onCancel={cancelHandler}
                onOk={toggleSettings}
                okText="Apply settings"
                className="right-menu__modal"
            >

                <ul className="right-menu__settings">
                    <li className="right-menu__setting">
                        Max subtitle duration
                        <Slider defaultValue={props.settings.maxDuration}
                            onAfterChange={(val) => props.dispatch({ type: "max-duration", val })}
                            min={3}
                            max={10}
                            step={.1}
                            marks={maxMarker}
                        />
                    </li>
                    <li className="right-menu__setting">
                        Min subtitle duration
                        <Slider defaultValue={props.settings.minDuration}
                            onAfterChange={(val) => props.dispatch({ type: "min-duration", val })}
                            min={1}
                            max={props.settings.maxDuration}
                            step={.1}
                            marks={minMarker}
                        />
                    </li>
                    <li className="right-menu__setting">
                        Reading spead
                        <Slider defaultValue={props.settings.avarageSpeed}
                            onAfterChange={(val) => props.dispatch({ type: 'avarage-speed', val })}
                            max={21}
                            min={10}
                            marks={speedMarker}
                        />
                    </li>
                </ul>
            </Modal>
        </>
    )
}


export default Settings;