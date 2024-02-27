import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

export default function UploadImageProfile({setClient, client}) {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;
        console.log(files);
        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });
        setClient({...client, image: files[0]})
        setTotalSize(_totalSize);
    };
        
    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast}></Toast>
            <FileUpload mode="basic" name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={onTemplateSelect} />
        </div>  
    )
}