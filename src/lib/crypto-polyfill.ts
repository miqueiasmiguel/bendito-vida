import * as ExpoCrypto from 'expo-crypto';

// React Native does not expose crypto.getRandomValues or crypto.subtle, both
// required by Supabase for PKCE code verifier generation and SHA-256 challenge.
if (typeof global.crypto === 'undefined') {
  (global as unknown as Record<string, unknown>).crypto = {};
}

const g = global as unknown as { crypto: Crypto };

if (!g.crypto.getRandomValues) {
  (g.crypto as unknown as Record<string, unknown>).getRandomValues = <T extends ArrayBufferView>(
    array: T,
  ): T => {
    const bytes = ExpoCrypto.getRandomBytes(array.byteLength);
    new Uint8Array(
      (array as unknown as { buffer: ArrayBuffer }).buffer,
      (array as unknown as { byteOffset: number }).byteOffset,
      array.byteLength,
    ).set(bytes);
    return array;
  };
}

if (!g.crypto.subtle) {
  (g.crypto as unknown as Record<string, unknown>).subtle = {
    async digest(algorithm: string | { name: string }, data: ArrayBuffer): Promise<ArrayBuffer> {
      const alg = typeof algorithm === 'string' ? algorithm : algorithm.name;
      if (alg.replace('-', '').toLowerCase() !== 'sha256') {
        throw new Error(`crypto-polyfill: unsupported algorithm ${alg}`);
      }
      const bytes = new Uint8Array(data);
      const hex = await ExpoCrypto.digestStringAsync(
        ExpoCrypto.CryptoDigestAlgorithm.SHA256,
        String.fromCharCode(...bytes),
        { encoding: ExpoCrypto.CryptoEncoding.HEX },
      );
      const result = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
      }
      return result.buffer;
    },
  };
}
