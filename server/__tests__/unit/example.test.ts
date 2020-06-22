/* eslint-disable no-undef */

describe('Test example', () => {
  
  interface Hello {
    name: string
  }
  
  const me: Hello = {
    name: 'me'
  };

  it('works', () => {
    expect(me.name).toBe('me');
  });
  
});
