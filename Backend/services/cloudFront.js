import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";

const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n');
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
const dateLessThan = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
const distributionName = `https://${process.env.CLOUDFRONT_DOMAIN_NAME}`;

export function createCloudFrontSignedUrl({ fileKey, fileName, download }) {
    try {

        const url = getCloudFrontSignedUrl({
            url: `${distributionName}/${fileKey}?response-content-disposition=${encodeURIComponent(`${download ? "attachment" : "inline"}; filename="${fileName}"`)}`,
            keyPairId,
            dateLessThan,
            privateKey,
        });

        return url;

    }
    catch (error) {
        return null;
    }
}
