using System;
using Xunit;

/*
 * These are unit tests for the public methods of the helper API.
 *
 * The associated library is a check character generator and verifier for a GS1
 * GMN.
 *
 * You should rerun these tests if you modify the library in any way.
 *
 * Alternatively, if you reimplement the library then you can simply run the
 * tests against your own code if the method names are compatible (or you
 * provide wrappers). Simply modify the static import immediately below.
 *
 */
using static GS1.GMN;

namespace GMNTests
{
    public class UnitTest1
    {
        [Fact]
        public void VerifyCheckCharacters_UsingExampleFromGenSpecs()
        {
            Assert.True(VerifyCheckCharacters("1987654Ad4X4bL5ttr2310c2K"));
        }

        [Fact]
        public void CheckCharacters_UsingExampleFromGenSpecs()
        {
            Assert.Equal("2K",CheckCharacters("1987654Ad4X4bL5ttr2310c"));
        }

        [Fact]
        public void AddCheckCharacters_UsingExampleFromGenSpecs()
        {
            Assert.Equal("1987654Ad4X4bL5ttr2310c2K", AddCheckCharacters("1987654Ad4X4bL5ttr2310c"));
        }

        [Fact]
        public void VerifyCheckCharacters_InvalidCheck1()
        {
            Assert.False(VerifyCheckCharacters("1987654Ad4X4bL5ttr2310cXK"));
        }

        [Fact]
        public void VerifyCheckCharacters_InvalidCheck2()
        {
            Assert.False(VerifyCheckCharacters("1987654Ad4X4bL5ttr2310c2X"));
        }

        [Fact]
        public void VerifyCheckCharacters_First5NotNumericAtStart()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("X987654Ad4X4bL5ttr2310c2K"));
            Assert.Contains("must be digits", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_First5NotNumericAtEnd()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("1987X54Ad4X4bL5ttr2310c2K"));
            Assert.Contains("must be digits", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_InvalidCharacterNearStart()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("198765£Ad4X4bL5ttr2310c2K"));
            Assert.Contains("invalid character", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_InvalidCharacterAtEndModel()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("1987654Ad4X4bL5ttr2310£2K"));
            Assert.Contains("invalid character", e.Message.ToLower());
        }

        [Fact]
        public void AddCheckCharacters_InvalidCharacterAtEndModel()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => AddCheckCharacters("1987654Ad4X4bL5ttr2310£"));
            Assert.Contains("invalid character", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_InvalidCharacterAtCheck1()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("1987654Ad4X4bL5ttr2310cxK"));
            Assert.Contains("invalid check character", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_InvalidCharacterAtCheck2()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("1987654Ad4X4bL5ttr2310c2x"));
            Assert.Contains("invalid check character", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_TooShort()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("12345XX"));
            Assert.Contains("too short", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_Shortest()
        {
            Assert.True(VerifyCheckCharacters("12345ANJ"));
        }

        [Fact]
        public void VerifyCheckCharacters_TooLong()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharacters("123456789012345678901234XX"));
            Assert.Contains("too long", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharacters_Longest()
        {
            Assert.True(VerifyCheckCharacters("12345678901234567890123NT"));
        }

        [Fact]
        public void CheckCharacters_TooShort()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => CheckCharacters("12345"));
            Assert.Contains("too short", e.Message.ToLower());
        }

        [Fact]
        public void CheckCharacters_Shortest()
        {
            Assert.Equal("NJ",CheckCharacters("12345A"));
        }

        [Fact]
        public void CheckCharacters_TooLong()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => CheckCharacters("123456789012345678901234"));
            Assert.Contains("too long", e.Message.ToLower());
        }

        [Fact]
        public void CheckCharacters_Longest()
        {
            Assert.Equal("NT",CheckCharacters("12345678901234567890123"));
        }

        [Fact]
        public void VerifyCheckCharacters_AllCSET82()
        {
            // The aim here is to prevent regressions due to modifications of the CSET 82 characters
            Assert.True(VerifyCheckCharacters("12345_ABCDEFGHIJKLMCP"));
            Assert.True(VerifyCheckCharacters("12345_NOPQRSTUVWXYZDN"));
            Assert.True(VerifyCheckCharacters("12345_abcdefghijklmN3"));
            Assert.True(VerifyCheckCharacters("12345_nopqrstuvwxyzP2"));
            Assert.True(VerifyCheckCharacters("12345_!\"%&'()*+,-./LC"));
            Assert.True(VerifyCheckCharacters("12345_0123456789:;<=>?62"));
        }

        [Fact]
        public void VerifyCheckCharacters_AllCSET32()
        {
            // The aim here is to prevent regressions due to modifications of the CSET 32 characters
            Assert.True(VerifyCheckCharacters("7907665Bm8v2AB"));
            Assert.True(VerifyCheckCharacters("97850l6KZm0yCD"));
            Assert.True(VerifyCheckCharacters("225803106GSpEF"));
            Assert.True(VerifyCheckCharacters("149512464PM+GH"));
            Assert.True(VerifyCheckCharacters("62577B8fRG7HJK"));
            Assert.True(VerifyCheckCharacters("515942070CYxLM"));
            Assert.True(VerifyCheckCharacters("390800494sP6NP"));
            Assert.True(VerifyCheckCharacters("386830132uO+QR"));
            Assert.True(VerifyCheckCharacters("53395376X1:nST"));
            Assert.True(VerifyCheckCharacters("957813138Sb6UV"));
            Assert.True(VerifyCheckCharacters("530790no0qOgWX"));
            Assert.True(VerifyCheckCharacters("62185314IvwmYZ"));
            Assert.True(VerifyCheckCharacters("23956qk1&dB!23"));
            Assert.True(VerifyCheckCharacters("794394895ic045"));
            Assert.True(VerifyCheckCharacters("57453Uq3qA<H67"));
            Assert.True(VerifyCheckCharacters("62185314IvwmYZ"));
            Assert.True(VerifyCheckCharacters("0881063PhHvY89"));
        }

        [Fact]
        public void VerifyCheckCharacters_MinimumIntermediateSum()
        {
            Assert.True(VerifyCheckCharacters("00000!HV"));
        }

        [Fact]
        public void VerifyCheckCharacters_MaximumIntermediateSum()
        {
            Assert.True(VerifyCheckCharacters("99999zzzzzzzzzzzzzzzzzzT2"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_UsingExampleFromGenSpecs()
        {
            Assert.True(VerifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2K"));
        }

        [Fact]
        public void CheckCharactersGcpModel_UsingExampleFromGenSpecs()
        {
            Assert.Equal("2K",CheckCharactersGcpModel("1987654","Ad4X4bL5ttr2310c"));
        }

        [Fact]
        public void AddCheckCharactersGcpModel_UsingExampleFromGenSpecs()
        {
            Assert.Equal("1987654Ad4X4bL5ttr2310c2K", AddCheckCharactersGcpModel("1987654","Ad4X4bL5ttr2310c"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_InvalidCheck1()
        {
            Assert.False(VerifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","XK"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_InvalidCheck2()
        {
            Assert.False(VerifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2X"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_CheckTooShort()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","3"));
            Assert.Contains("check must be 2 characters long", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_CheckTooLong()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2KX"));
            Assert.Contains("check must be 2 characters long", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_GcpTooShort()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("1234","Ad4X4bL5ttr2310c","XX"));
            Assert.Contains("gs1 company prefix is too short", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_GcpNotTooShort()
        {
            Assert.True(VerifyCheckCharactersGcpModelChecks("12345","Ad4X4bL5ttr2310c","66"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_GcpTooLong()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("1234567890123","Ad4X4bL5","XX"));
            Assert.Contains("gs1 company prefix is too long", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_GcpNotTooLong()
        {
            Assert.True(VerifyCheckCharactersGcpModelChecks("123456789012","Ad4X4bL5ttr","3R"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_GcpNotNumeric()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("198765A","Ad4X4bL5ttr2310c","XX"));
            Assert.Contains("gs1 company prefix must only contain digits", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_ModelEmpty()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("1987654","","3T"));
            Assert.Contains("model reference must contain at least one character", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_OversizeShortestGCP()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("12345","6789012345678901234","XX"));
            Assert.Contains("input is too long", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_NotOversizeShortestGCP()
        {
            Assert.True(VerifyCheckCharactersGcpModelChecks("12345","678901234567890123","NT"));
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_OversizeLongestGCP()
        {
            Exception e = Assert.ThrowsAny<Exception>(() => VerifyCheckCharactersGcpModelChecks("123456789012","345678901234","XX"));
            Assert.Contains("input is too long", e.Message.ToLower());
        }

        [Fact]
        public void VerifyCheckCharactersGcpModelChecks_NotOversizeLongestGCP()
        {
            Assert.True(VerifyCheckCharactersGcpModelChecks("123456789012","34567890123","NT"));
        }

    }
}
