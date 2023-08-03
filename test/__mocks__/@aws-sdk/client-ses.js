const SES = jest.createMockFromModule('@aws-sdk/client-ses');
SES.SESClient = class {
  send() {
    return { $metadata: { httpStatusCode: 200 } };
  }
};
module.exports = SES;
