// const AWS = require('aws-sdk');

// const keys = require('../config/keys');

// exports.s3Upload = async image => {
//   try {
//     let imageUrl = '';
//     let imageKey = '';

//     if (!keys.aws.accessKeyId) {
//       console.warn('Missing aws keys');
//     }

//     if (image) {
//       const s3bucket = new AWS.S3({
//         accessKeyId: keys.aws.accessKeyId,
//         secretAccessKey: keys.aws.secretAccessKey,
//         region: keys.aws.region
//       });

//       const params = {
//         Bucket: keys.aws.bucketName,
//         Key: image.originalname,
//         Body: image.buffer,
//         ContentType: image.mimetype
//       };

//       const s3Upload = await s3bucket.upload(params).promise();

//       imageUrl = s3Upload.Location;
//       imageKey = s3Upload.key;
//     }

//     return { imageUrl, imageKey };
//   } catch (error) {
//     return { imageUrl: '', imageKey: '' };
//   }
// };
const cloudinary = require('cloudinary').v2;

const streamifier = require('streamifier');
cloudinary.config({
  cloud_name: 'dwcb3mhwq',
  api_key: '622289317561798',
  api_secret: 'xm-ostPqN7ErfU4duJ8xkOK-rjM'
});

// exports.cloudinaryUpload = async image => {
//   try {
//     let imageUrl = '';
//     let imageKey = '';

//     console.log(image)

//     if (!image) {
//       throw new Error('No image provided');
//     }

//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(image.path, {
//       resource_type: 'auto', // Automatically detect the type of the resource (image or video)
//       public_id: image.originalname, // Optional: public ID for the image
//     });

//     // Get URL and public ID from the result
//     imageUrl = result.secure_url;
//     imageKey = result.public_id;

//     return { imageUrl, imageKey };
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return { imageUrl: '', imageKey: '' };
//   }
// };

// exports.cloudinaryUpload = async image => {
//   try {
//     let imageUrl = '';
//     let imageKey = '';

//     // Check if image is provided
//     if (!image || !image.buffer) {
//       throw new Error('No image provided');
//     }

//     // Create a readable stream from the buffer
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'auto', // Automatically detect the type of the resource
//         public_id: image.originalname, // Optional: public ID for the image
//       },
//       (error, result) => {
//         console.log(result);
//         if (error) {
//           throw error;
//         }
//         // Get URL and public ID from the result
//         imageUrl = result.secure_url;
//         imageKey = result.public_id;
//       }
//     );

//     // Convert buffer to stream and pipe to Cloudinary
//     await new Promise((resolve, reject) => {
//       streamifier.createReadStream(image.buffer).pipe(uploadStream).on('finish', resolve).on('error', reject);
//     });

//     return { imageUrl, imageKey };
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return { imageUrl: '', imageKey: '' };
//   }
// };


exports.cloudinaryUpload = async image => {
  try {
    let imageUrl = '';
    let imageKey = '';

    // Check if image is provided
    if (!image || !image.buffer) {
      throw new Error('No image provided');
    }

    // Return a Promise that resolves with the image URL and key
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect the type of the resource
          public_id: image.originalname, // Optional: public ID for the image
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          // Resolve with URL and public ID from the result
          resolve({ imageUrl: result.secure_url, imageKey: result.public_id });
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      streamifier.createReadStream(image.buffer).pipe(uploadStream);
    });

    // Destructure the result from the resolved Promise
    imageUrl = uploadResult.imageUrl;
    imageKey = uploadResult.imageKey;
    // { imageUrl, imageKey } = uploadResult;

    return { imageUrl, imageKey };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { imageUrl: '', imageKey: '' };
  }
};