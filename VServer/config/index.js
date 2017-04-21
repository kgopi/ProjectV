/**
 * Created by kgopi on 02/02/17.
 */
'use strict';

var config = {};

function configure(env) {

    config.env = env.NODE_ENV || 'development';

    // AWS SDK
    var awsRegion = env.AWS_REGION || 'us-east-1';

    config.apiCredentials = {
        'aws': {
            'region': awsRegion
        }
    };

    config.listenPort = env.API_LISTEN_PORT || 7000;
    config.sslCert = {
        'key': env.SSL_KEY_FILE || './cert/local/server.key',
        'cert': env.SSL_CERT_FILE || './cert/local/server.crt'
    };

    config.aws = {
        folders: {
            raw: "raw"
        },
        buckets: {
            assets: env.S3_ASSETS_BUCKET || 'gsnap-avengers-dev',
            videos: env.S3_VIDEO_TRANSCODED_BUCKET || 'gsnap-avengers-dev',
            attachments: env.S3_ATTACHMENTS_BUCKET || 'gsnap-avengers-dev',
            videoThumbnail: env.S3_VIDEO_THUMBNAIL_BUCKET || 'gsnap-avengers-dev',
        },
        distributions: {
            assets: env.CF_ASSETS_DISTRO || 'd7te7r654fop1.cloudfront.net',
            videoTranscoded: env.CF_VIDEO_TRANSCODED_DISTRO || 'd7te7r654fop1.cloudfront.net',
            videoThumbnail: env.CF_VIDEO_THUMBNAIL_DISTRO || 'd7te7r654fop1.cloudfront.net',
            attachments: env.CF_ATTACHMENTS_DISTRO || 'd7te7r654fop1.cloudfront.net'
        },
        presign: {
            keypairId: env.CF_KEYPAIR_ID || 'APKAIXRNCS4VVR6ISWZA', // This is key-pair id for signing cloudfront URL
            privateKeyPath: env.CF_PRESIGNED_PEM_URL || '/Users/kgopi/Gainsight/GSnap/api/cloudfrontPresignedUrl.pem',
            expireTime: (24 * 60 * 60 * 1000), //24 hours in milliseconds
            longExpireTime : (365 * 24 * 60 * 60 * 1000 )
        }
    };
    return config;
}

module.exports = config;
module.exports.configure = configure;