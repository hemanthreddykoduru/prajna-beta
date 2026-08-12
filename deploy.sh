#!/bin/bash
export AWS_DEFAULT_REGION="us-east-1"

BUCKET_NAME="testing-prajna-ui-$(date +%s)"
echo "Creating bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME

aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
sleep 2
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET_NAME/*\"}]}"
aws s3 website s3://$BUCKET_NAME/ --index-document index.html --error-document index.html

echo "Syncing files..."
aws s3 sync dist/ s3://$BUCKET_NAME/

echo "Creating CloudFront configuration..."
node -e "
const fs = require('fs');
const bucket = '$BUCKET_NAME';
const config = {
  CallerReference: bucket,
  Aliases: { Quantity: 0 },
  DefaultRootObject: 'index.html',
  Origins: {
    Quantity: 1,
    Items: [
      {
        Id: 'S3-' + bucket,
        DomainName: bucket + '.s3-website-us-east-1.amazonaws.com',
        CustomOriginConfig: {
          HTTPPort: 80,
          HTTPSPort: 443,
          OriginProtocolPolicy: 'http-only'
        }
      }
    ]
  },
  DefaultCacheBehavior: {
    TargetOriginId: 'S3-' + bucket,
    ViewerProtocolPolicy: 'redirect-to-https',
    MinTTL: 0,
    AllowedMethods: {
      Quantity: 2,
      Items: ['HEAD', 'GET'],
      CachedMethods: { Quantity: 2, Items: ['HEAD', 'GET'] }
    },
    ForwardedValues: {
      QueryString: false,
      Cookies: { Forward: 'none' }
    }
  },
  Comment: 'testing prajna',
  Enabled: true
};
fs.writeFileSync('cf-config.json', JSON.stringify(config));
"

echo "Deploying to CloudFront..."
aws cloudfront create-distribution --distribution-config file://cf-config.json > cf-output.json
echo "CloudFront Domain Name:"
node -e "console.log(require('./cf-output.json').Distribution.DomainName)"
