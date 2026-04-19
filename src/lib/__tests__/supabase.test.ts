jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ auth: {} })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import { supabase } from '../supabase';

describe('supabase client', () => {
  it('exports a supabase client instance', () => {
    expect(supabase).toBeDefined();
  });

  it('client was created with createClient', () => {
    const { createClient } = require('@supabase/supabase-js');
    expect(createClient).toHaveBeenCalledTimes(1);
  });

  it('passes PKCE flow type to createClient', () => {
    const { createClient } = require('@supabase/supabase-js');
    const callArgs = createClient.mock.calls[0];
    expect(callArgs[2].auth.flowType).toBe('pkce');
  });
});
