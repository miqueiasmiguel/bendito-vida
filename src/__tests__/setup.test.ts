import * as theme from '@/theme';

describe('Test Setup', () => {
  it('should run tests correctly', () => {
    expect(true).toBe(true);
  });

  it('should resolve @ alias', () => {
    expect(theme).toBeDefined();
  });
});
