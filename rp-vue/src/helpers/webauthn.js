const crypto = require("crypto");

/**
 * Request creation of a new set of credentials using Webauthn
 */
async function createCredential(extensions = {}) {
  const challenge = generateRandomBytes(16);

  let credential = null;

  try {
    credential = await navigator.credentials.create({
      publicKey: getPublicKeyCredentialCreationOptions(challenge, extensions),
    });
  } catch (e) {
    console.error(e);
    credential = null;
  }

  return { credential, challenge };
}

async function getAssertion() {
  const challenge = generateRandomBytes(16);

  let credential = null;
  try {
    credential = await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        timeout: 60000,
        userVerification: "discouraged",
      },
    });
  } catch (e) {
    console.error(e);
    credential = null;
  }

  return { credential, challenge };
}

function parseClientDataJson(credential) {
  const utf8Decoder = new TextDecoder("utf-8");
  const decoded = utf8Decoder.decode(credential.response.clientDataJSON);
  return JSON.parse(decoded);
}

/**
 *  Gets a publicKeyCredentialCreationOptions object for registering credentials
 */
function getPublicKeyCredentialCreationOptions(c, extensions) {
  return {
    challenge: c,
    extensions: extensions,
    rp: {
      name: "FIDO2 Extension Tester",
      id: "localhost",
    },
    user: {
      id: generateRandomBytes(16),
      name: "testuser",
      displayName: "TestUser",
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
      requireResidentKey: true,
      userVerification: "discouraged",
    },
    timeout: 60000,
    attestation: "none",
  };
}

/**
 * Generates cryptographic random bytes
 */
function generateRandomBytes(len) {
  return crypto.randomBytes(len);
}

export default {
  generateRandomBytes,
  createCredential,
  parseClientDataJson,
  getAssertion,
};
