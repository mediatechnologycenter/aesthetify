/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useState, useEffect, useContext } from 'react';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import { CircularProgress, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Context } from '../utils/Store';
import { get_number_of_images_in_queue } from './functions';

export default function UploadFiles(props) {
    const [state, dispatch] = useContext(Context);
    const { user, token } = props;
    const [, setLoading] = useState(false)
    const [metaDataLength, setMetaDataLength] = useState(0)
    const [showResponseInfo, setShowResponseInfo] = useState(false);
    const [responseInfo, setResponseInfo] = useState('');
    const [responseStatus, setResponseStatus] = useState('200');

    const handleCloseResponseInfo = () => {
        setShowResponseInfo(false)
    };

    const getUploadParams = ({ meta }) => {
        setLoading(true)
        return {
            // url: "https://httpbin.org/post",
            url: "/api/image",
            fields: {
                "userId": user,
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    }

    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, remove, xhr }, status) => {
        if (status === 'done' || status === 'error_upload' || status === 'exception_upload') {
            console.log(meta, remove, xhr, status)
            remove()


            if (status === 'done') {
                setResponseInfo(`Processing image ${meta.name}`)
                console.log("Added uploaded image to queue")
                // TODO: This creates a request for every uploaded image
                get_number_of_images_in_queue(token, dispatch, state)
            } else {
                setResponseInfo(`Response status ${xhr.statusText} for image ${meta.name}. Response text: ${xhr.responseText}`)
            }
            setResponseStatus(xhr.status)
            setShowResponseInfo(true)
            // dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" });
        }
    }

    // The upload progress shows the progress of the upload
    const UploadProgress = (props) => {
        const { files_length } = props
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <CircularProgress />
                {(files_length === 1)
                    ? <Typography>{`${files_length} image left`}</Typography>
                    : <Typography>{`${files_length} images left`}</Typography>}
            </div>
        )
    }

    const SpecialLayout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
        return (
            <div>
                <div {...dropzoneProps}>
                    {files.length < maxFiles && input}
                </div>
            </div>
        )
    }

    const InputClass = ({ className,
        labelClassName,
        labelWithFilesClassName,
        getFilesFromEvent,
        accept,
        multiple,
        onFiles,
        files }) => {
        return (
            <label
                className={files.length > 0 ? labelWithFilesClassName : labelClassName}
                style={{ color: "#fd2e58" }}
            >
                {files.length > 0 ? <UploadProgress files_length={files.length}></UploadProgress> : "Drag Images or Click to Browse"}
                <input
                    className={className}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={files.length > 0 ? true : false}
                    onChange={async e => {
                        const target = e.target
                        const chosenFiles = await getFilesFromEvent(e)
                        setMetaDataLength(chosenFiles.length)
                        onFiles(chosenFiles)
                        //@ts-ignore
                        target.value = null
                    }}
                />
            </label>

        )
    }

    function CircularProgressWithLabel(props) {
        return (
            <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" {...props} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                </Box>
            </Box>
        );
    }

    InputClass.propTypes = {
        className: PropTypes.any,
        labelClassName: PropTypes.any,
        labelWithFilesClassName: PropTypes.any,
        style: PropTypes.any,
        labelStyle: PropTypes.any,
        labelWithFilesStyle: PropTypes.any,
        getFilesFromEvent: PropTypes.any,
        accept: PropTypes.any,
        multiple: PropTypes.any,
        disabled: PropTypes.any,
        content: PropTypes.any,
        withFilesContent: PropTypes.any,
        onFiles: PropTypes.any,
        files: PropTypes.any,
    }

    SpecialLayout.propTypes = {
        input: PropTypes.any,
        previews: PropTypes.any,
        submitButton: PropTypes.any,
        dropzoneProps: PropTypes.any,
        files: PropTypes.any,
        extra: PropTypes.any,
    }

    CircularProgressWithLabel.propTypes = {
        value: PropTypes.any
    }


    return (<Box>
        <div style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            width: '100%',
            justifyContent: 'center'
        }}>
        </div>
        <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            accept="image/*"
            timeout={1000000}
            LayoutComponent={SpecialLayout}
            PreviewComponent={null}
            classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
            InputComponent={InputClass}
            submitButtonContent={"Done"}
            styles={{
                dropzone: { width: "100%", height: 100, overflow: "hidden", border: 'none' },
            }}
        />
        <Snackbar open={showResponseInfo} autoHideDuration={3000} onClose={handleCloseResponseInfo} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity={responseStatus === 202 ? "success" : 'warning'} onClose={handleCloseResponseInfo}>
                {responseInfo}
            </Alert>
        </Snackbar>
    </Box >
    )
}

UploadFiles.propTypes = {
    props: PropTypes.any,
    user: PropTypes.string
}