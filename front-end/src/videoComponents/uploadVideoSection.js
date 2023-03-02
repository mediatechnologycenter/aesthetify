/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import { useContext, useState } from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Context } from '../utils/Store';

export default function UploadVideoSection(props) {
  const { user, token } = props;
  const [, dispatch] = useContext(Context);
  const [showResponseInfo, setShowResponseInfo] = useState(false);
  const [responseInfo, setResponseInfo] = useState('');
  const [responseStatus, setResponseStatus] = useState('200');
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return {
      url: '/video-api/video',
      fields: {
        "userId": user,
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  const handleCloseResponseInfo = () => {
    setShowResponseInfo(false)
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, remove, xhr }, status) => {
    if (status === 'done' || status === 'error_upload' || status === 'exception_upload') {
      setResponseInfo(xhr.responseText)
      setResponseStatus(xhr.status)
      setShowResponseInfo(true)
      dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" });
      remove()
    }
  }

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    allFiles.forEach(f => f.remove())
  }

  const submitButtonContainer = (props) => {
    const { className, style, disabled, onSubmit, files } = props

    const _disabled =
      files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status)) ||
      !files.some(f => ['headers_received', 'done'].includes(f.meta.status))

    const handleSubmit = () => {
      onSubmit(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)))
    }
    return (
      <div className={className} style={style}>
        <Button variant={'contained'} color={'primary'} onClick={handleSubmit} disabled={disabled || _disabled}>
          Finish
        </Button>
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
        Drag Video or Click to Browse
        <input
          className={className}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={files.length > 0 ? true : false}
          onChange={async e => {
            const target = e.target
            const chosenFiles = await getFilesFromEvent(e)
            onFiles(chosenFiles)
            //@ts-ignore
            target.value = null
          }}
        />
      </label>

    )
  }

  return (
    <Grid item xs={12}>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        InputComponent={InputClass}
        maxFiles={1}
        SubmitButtonComponent={submitButtonContainer}
        onSubmit={handleSubmit}
        accept="video/*"
        styles={{
          dropzone: { width: "100%", height: 100, overflow: "hidden", border: 'none' },
        }}
      />
      <Snackbar open={showResponseInfo} autoHideDuration={3000} onClose={handleCloseResponseInfo} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={responseStatus === 200 ? "success" : 'warning'} onClose={handleCloseResponseInfo}>
          {responseInfo}
        </Alert>
      </Snackbar>
    </Grid>

  )
}