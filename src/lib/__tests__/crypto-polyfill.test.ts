jest.mock('expo-crypto', () => ({
  getRandomBytes: jest.fn((len: number) => new Uint8Array(len).fill(0xab)),
  digestStringAsync: jest.fn().mockResolvedValue('deadbeef'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  CryptoEncoding: { HEX: 'hex' },
}));

describe('crypto-polyfill', () => {
  const originalCrypto = global.crypto;

  beforeEach(() => {
    // Force polyfill to run by removing crypto
    Object.defineProperty(global, 'crypto', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    jest.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(global, 'crypto', {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it('installs crypto polyfill when global.crypto is undefined', () => {
    require('../crypto-polyfill');
    expect(global.crypto).toBeDefined();
  });

  it('getRandomValues fills the array', () => {
    require('../crypto-polyfill');
    const buf = new Uint8Array(4);
    global.crypto.getRandomValues(buf);
    expect(buf[0]).toBe(0xab);
  });

  it('does not override existing getRandomValues', () => {
    const existing = jest.fn();
    Object.defineProperty(global, 'crypto', {
      value: { getRandomValues: existing },
      writable: true,
      configurable: true,
    });
    require('../crypto-polyfill');
    global.crypto.getRandomValues(new Uint8Array(1));
    expect(existing).toHaveBeenCalledTimes(1);
  });
});
