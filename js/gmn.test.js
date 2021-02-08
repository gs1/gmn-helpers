/*
 * These are unit tests for the public methods of the helper API.
 *
 * The associated library is a check character generator and verifier for a GS1
 * Global Model Number.
 *
 * You should rerun these tests if you modify the library in any way.
 *
 * Alternatively, if you reimplement the library then you can simply run the
 * tests against your own code if the method names are compatible (or you
 * provide wrappers). Simply modify the static import immediately below.
 *
 */

var GMN = require('./gmn');

test('verifyCheckCharacters_UsingExampleFromGenSpecs', () => {
  expect(GMN.verifyCheckCharacters("1987654Ad4X4bL5ttr2310c2K")).toBe(true);
});

test('checkCharacters_UsingExampleFromGenSpecs', () => {
  expect(GMN.checkCharacters("1987654Ad4X4bL5ttr2310c")).toBe("2K");
});

test('addCheckCharacters_UsingExampleFromGenSpecs', () => {
  expect(GMN.addCheckCharacters("1987654Ad4X4bL5ttr2310c")).toBe("1987654Ad4X4bL5ttr2310c2K");
});

test('verifyCheckCharacters_InvalidCheck1', () => {
  expect(GMN.verifyCheckCharacters("1987654Ad4X4bL5ttr2310cXK")).toBe(false);
});

test('verifyCheckCharacters_InvalidCheck2', () => {
  expect(GMN.verifyCheckCharacters("1987654Ad4X4bL5ttr2310c2X")).toBe(false);
});

test('verifyCheckCharacters_First5NotNumericAtStart', () => {
  expect( () => GMN.verifyCheckCharacters("X987654Ad4X4bL5ttr2310c2K")).toThrow("must be digits");
});

test('verifyCheckCharacters_First5NotNumericAtEnd', () => {
  expect( () => GMN.verifyCheckCharacters("1987X54Ad4X4bL5ttr2310c2K")).toThrow("must be digits");
});

test('verifyCheckCharacters_InvalidCharacterNearStart', () => {
  expect( () => GMN.verifyCheckCharacters("198765£Ad4X4bL5ttr2310c2K")).toThrow("Invalid character");
});

test('verifyCheckCharacters_InvalidCharacterAtEndModel', () => {
  expect( () => GMN.verifyCheckCharacters("1987654Ad4X4bL5ttr2310£2K")).toThrow("Invalid character");
});

test('addCheckCharacters_InvalidCharacterAtEndModel', () => {
  expect( () => GMN.addCheckCharacters("1987654Ad4X4bL5ttr2310£")).toThrow("Invalid character");
});

test('verifyCheckCharacters_InvalidCharacterAtCheck1', () => {
  expect( () => GMN.verifyCheckCharacters("1987654Ad4X4bL5ttr2310cxK")).toThrow("Invalid check character");
});

test('verifyCheckCharacters_InvalidCharacterAtCheck2', () => {
  expect( () => GMN.verifyCheckCharacters("1987654Ad4X4bL5ttr2310c2x")).toThrow("Invalid check character");
});

test('verifyCheckCharacters_TooShort', () => {
  expect( () => GMN.verifyCheckCharacters("12345XX")).toThrow("too short");
});

test('verifyCheckCharacters_Shortest', () => {
  expect(GMN.verifyCheckCharacters("12345ANJ")).toBe(true);
});

test('verifyCheckCharacters_TooLong', () => {
  expect( () => GMN.verifyCheckCharacters("123456789012345678901234XX")).toThrow("too long");
});

test('verifyCheckCharacters_Longest', () => {
  expect(GMN.verifyCheckCharacters("12345678901234567890123NT")).toBe(true);
});

test('checkCharacters_TooShort', () => {
  expect( () => GMN.checkCharacters("12345")).toThrow("too short");
});

test('checkCharacters_Shortest', () => {
  expect(GMN.checkCharacters("12345A")).toBe("NJ");
});

test('checkCharacters_TooLong', () => {
  expect( () => GMN.checkCharacters("123456789012345678901234")).toThrow("too long");
});

test('checkCharacters_Longest', () => {
  expect(GMN.checkCharacters("12345678901234567890123")).toBe("NT");
});

test('verifyCheckCharacters_AllCSET82', () => {
  expect(GMN.verifyCheckCharacters("12345_ABCDEFGHIJKLMCP")).toBe(true);
  expect(GMN.verifyCheckCharacters("12345_NOPQRSTUVWXYZDN")).toBe(true);
  expect(GMN.verifyCheckCharacters("12345_abcdefghijklmN3")).toBe(true);
  expect(GMN.verifyCheckCharacters("12345_nopqrstuvwxyzP2")).toBe(true);
  expect(GMN.verifyCheckCharacters("12345_!\"%&'()*+,-./LC")).toBe(true);
  expect(GMN.verifyCheckCharacters("12345_0123456789:;<=>?62")).toBe(true);
});

test('verifyCheckCharacters_AllCSET32', () => {
  expect(GMN.verifyCheckCharacters("7907665Bm8v2AB")).toBe(true);
  expect(GMN.verifyCheckCharacters("97850l6KZm0yCD")).toBe(true);
  expect(GMN.verifyCheckCharacters("225803106GSpEF")).toBe(true);
  expect(GMN.verifyCheckCharacters("149512464PM+GH")).toBe(true);
  expect(GMN.verifyCheckCharacters("62577B8fRG7HJK")).toBe(true);
  expect(GMN.verifyCheckCharacters("515942070CYxLM")).toBe(true);
  expect(GMN.verifyCheckCharacters("390800494sP6NP")).toBe(true);
  expect(GMN.verifyCheckCharacters("386830132uO+QR")).toBe(true);
  expect(GMN.verifyCheckCharacters("53395376X1:nST")).toBe(true);
  expect(GMN.verifyCheckCharacters("957813138Sb6UV")).toBe(true);
  expect(GMN.verifyCheckCharacters("530790no0qOgWX")).toBe(true);
  expect(GMN.verifyCheckCharacters("62185314IvwmYZ")).toBe(true);
  expect(GMN.verifyCheckCharacters("23956qk1&dB!23")).toBe(true);
  expect(GMN.verifyCheckCharacters("794394895ic045")).toBe(true);
  expect(GMN.verifyCheckCharacters("57453Uq3qA<H67")).toBe(true);
  expect(GMN.verifyCheckCharacters("62185314IvwmYZ")).toBe(true);
  expect(GMN.verifyCheckCharacters("0881063PhHvY89")).toBe(true);
});

test('verifyCheckCharacters_MinimumIntermediateSum', () => {
  expect(GMN.verifyCheckCharacters("00000!HV")).toBe(true);
});

test('verifyCheckCharacters_MaximumIntermediateSum', () => {
  expect(GMN.verifyCheckCharacters("99999zzzzzzzzzzzzzzzzzzT2")).toBe(true);
});

test('verifyCheckCharactersGcpModelChecks_UsingExampleFromGenSpecs', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2K")).toBe(true);
});

test('checkCharactersGcpModel_UsingExampleFromGenSpecs', () => {
  expect(GMN.checkCharactersGcpModel("1987654","Ad4X4bL5ttr2310c")).toBe("2K");
});

test('addCheckCharactersGcpModel_UsingExampleFromGenSpecs', () => {
  expect(GMN.addCheckCharactersGcpModel("1987654","Ad4X4bL5ttr2310c")).toBe("1987654Ad4X4bL5ttr2310c2K");
});

test('verifyCheckCharactersGcpModelChecks_InvalidCheck1', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","XK")).toBe(false);
});

test('verifyCheckCharactersGcpModelChecks_InvalidCheck2', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2X")).toBe(false);
});

test('verifyCheckCharactersGcpModelChecks_CheckTooShort', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","3")).toThrow("check must be 2 characters long");
});

test('verifyCheckCharactersGcpModelChecks_CheckTooLong', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2KX")).toThrow("check must be 2 characters long");
});

test('verifyCheckCharactersGcpModelChecks_GcpTooShort', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("1234","Ad4X4bL5ttr2310c","XX")).toThrow("GS1 Company Prefix is too short");
});

test('verifyCheckCharactersGcpModelChecks_GcpNotTooShort', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("12345","Ad4X4bL5ttr2310c","66")).toBe(true);
});

test('verifyCheckCharactersGcpModelChecks_GcpTooLong', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("1234567890123","Ad4X4bL5","XX")).toThrow("GS1 Company Prefix is too long");
});

test('verifyCheckCharactersGcpModelChecks_GcpNotTooLong', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("123456789012","Ad4X4bL5ttr","3R")).toBe(true);
});

test('verifyCheckCharactersGcpModelChecks_GcpNotNumeric', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("198765A","Ad4X4bL5ttr2310c","XX")).toThrow("GS1 Company Prefix must only contain digits");
});

test('verifyCheckCharactersGcpModelChecks_ModelEmpty', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("1987654","","3T")).toThrow("model reference must contain at least one character");
});

test('verifyCheckCharactersGcpModelChecks_OversizeShortestGCP', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("12345","6789012345678901234","XX")).toThrow("input is too long");
});

test('verifyCheckCharactersGcpModelChecks_NotOversizeShortestGCP', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("12345","678901234567890123","NT")).toBe(true);
});

test('verifyCheckCharactersGcpModelChecks_OversizeLongestGCP', () => {
  expect( () => GMN.verifyCheckCharactersGcpModelChecks("123456789012","345678901234","XX")).toThrow("input is too long");
});

test('verifyCheckCharactersGcpModelChecks_NotOversizeLongestGCP', () => {
  expect(GMN.verifyCheckCharactersGcpModelChecks("123456789012","34567890123","NT")).toBe(true);
});
