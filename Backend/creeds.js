let aws_keys = {
    s3: {
        region: 'us-east-2',
        accessKeyId: 'AKIA3EBUF4FC4WB2TUVZ',
        secretAccessKey: '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',
        //apiVersion: '2006-03-01',
    },
    dynamodb: {
        apiVersion: '2012-08-10',
        region: 'us-east-2',
        accessKeyId: "AKIA3EBUF4FC4J6L3CH7",
        secretAccessKey: "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"
    },
    rekognition: {
        apiVersion: '2016-06-27',
        region: 'us-east-2',
        accessKeyId: "AKIA3EBUF4FCV4YWBYVG",
        secretAccessKey: "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"
    },
    translate: {
        apiVersion: "2017-07-01",
        region: 'us-east-2',
        accessKeyId: "AKIA3EBUF4FC66YMC3TD",
        secretAccessKey: "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" 
    }

}
module.exports = aws_keys
