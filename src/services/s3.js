const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.awsID,
    secretAccessKey: process.env.awsSecret
});

exports.uploadImage = async (file, fileType) => {
    return new Promise(async (resolve, reject) => {
    try {
        const params = {
            Bucket: process.env.bucket,
            Key: `${Date.now()}.${fileType}`, 
            Body: file,
            ACL:'public-read'
        };
        s3.upload(params, function(err, data) {
            if (err) {
                reject(err);
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data.Location)
        });

    } catch(err){
        reject(err)
    }
})
}