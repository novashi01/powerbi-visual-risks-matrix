describe('marker label helpers (approximation)', () => {
  const approximateTextWidth = (text: string, fontSize: number) => {
    const avgCharWidth = 0.6;
    return Math.max(0, text.length * fontSize * avgCharWidth);
  };

  test('approximateTextWidth scales with font size and length', () => {
    const small = approximateTextWidth('ABC', 8);
    const large = approximateTextWidth('ABCDEFGHIJ', 12);
    expect(large).toBeGreaterThan(small);
    expect(Math.round(small)).toBeGreaterThan(0);
  });
});
