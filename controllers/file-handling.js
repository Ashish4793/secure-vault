import AWS from "aws-sdk"

//aws intialization

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-south-1',
});

export const getFiles = (req, res) => {
    if (req.isAuthenticated()) {
        const bucketName = process.env.BUCKET_NAME;
        const params = {
            Bucket: bucketName,
            Prefix: `${req.user._id}/`
        };
        const formatBytes = (bytes, decimals = 2) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        };
        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.error('Error listing files: ', err);
                res.render("dashboard", { files: [] })
            }
            const files = data.Contents.map((file) => {
                return {
                    name: file.Key.replace(`${req.user._id}/`, ''),
                    size: formatBytes(file.Size),
                    lastModified: file.LastModified,
                };
            });
            res.render("dashboard", { files: files })
        });
    } else {
        res.redirect("/login")
    }
}


export const uploadFile = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user._id == process.env.SUPERUSER){
            if (!req.files || !req.files.file) {
                return res.status(400).send('No files were uploaded.');
            }
            const file = req.files.file;
            const fileSize = req.files.file.size;
    
            if (fileSize > 2 * 1024 * 1024) { // 2 MB file size limit
                const message = "File should be less than 2 MB"
                res.redirect(`/dashboard?warningMessage=${encodeURIComponent(message)}`);
                return;
            }
            const key = `${req.user._id}/${file.name}`;
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Body: file.data,
            };
    
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.error('Error uploading to S3: ', err);
                    const message = "Something went wrong!"
                    res.redirect(`/dashboard?warningMessage=${encodeURIComponent(message)}`);
                }
                const message = `${file.name} uploaded successfully!`
                res.redirect(`/dashboard?successMessage=${encodeURIComponent(message)}`);
            });
        } else {
            const message = "Unauthorized!"
            res.redirect(`/dashboard?warningMessage=${encodeURIComponent(message)}`);
        } 
    } else {
        res.redirect("/login")
    }
}


export const downloadFile = (req, res) => {
    if (req.isAuthenticated()) {
        const { object_id } = req.body;
        const userId = req.user._id;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${userId}/${object_id}`,
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error('Error downloading file from S3: ', err);
                const message = "Something went wrong!"
                res.redirect(`/dashboard?warningMessage=${encodeURIComponent(message)}`);
            }

            res.attachment(object_id);
            res.send(data.Body); // Send the file data in the response
        });
    } else {
        res.redirect("/login");
    }

};

export const deleteFile = (req, res) => {
    if (req.isAuthenticated()) {
        if ( req.user._id == process.env.SUPERUSER ){
            const { object_id } = req.body;
            const userId = req.user._id;
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `${userId}/${object_id}`,
            };
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.error('Error deleting file from S3: ', err);
                    const message = "Something went wrong!"
                    res.redirect(`/dashboard?warningMessage=${encodeURIComponent(message)}`);
                }
    
                const message = `${object_id} deleted successfully!`;
                res.redirect(`/dashboard?successMessage=${encodeURIComponent(message)}`);
    
            });
        } else {
            const message = "Unauthorized!"
            res.redirect(`/dashboard?warningMessage=${encodeURIComponent(message)}`);        }
    } else {
        res.redirect("/login")
    }
};