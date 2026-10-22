import org.junit.Test;
import static org.junit.Assert.*;

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
import org.gs1.*;
import static org.gs1.GMN.*;

public class GMNTests
{

        @Test
        public void verifyCheckCharacters_UsingExampleFromGenSpecs() throws Exception
        {
            assertTrue(verifyCheckCharacters("1987654Ad4X4bL5ttr2310c2K"));
        }

        @Test
        public void checkCharacters_UsingExampleFromGenSpecs() throws Exception
        {
            assertEquals("2K",checkCharacters("1987654Ad4X4bL5ttr2310c"));
        }

        @Test
        public void addCheckCharacters_UsingExampleFromGenSpecs() throws Exception
        {
            assertEquals("1987654Ad4X4bL5ttr2310c2K", addCheckCharacters("1987654Ad4X4bL5ttr2310c"));
        }

        @Test
        public void verifyCheckCharacters_InvalidCheck1() throws Exception
        {
            assertFalse(verifyCheckCharacters("1987654Ad4X4bL5ttr2310cXK"));
        }

        @Test
        public void verifyCheckCharacters_InvalidCheck2() throws Exception
        {
            assertFalse(verifyCheckCharacters("1987654Ad4X4bL5ttr2310c2X"));
        }

        @Test
        public void verifyCheckCharacters_First5NotNumericAtStart()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("X987654Ad4X4bL5ttr2310c2K"));
            assertTrue(e.getMessage().toLowerCase().contains("must be digits"));
        }

        @Test
        public void verifyCheckCharacters_First5NotNumericAtEnd()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("1987X54Ad4X4bL5ttr2310c2K"));
            assertTrue(e.getMessage().toLowerCase().contains("must be digits"));
        }

        @Test
        public void verifyCheckCharacters_InvalidCharacterNearStart()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("198765\u00a3Ad4X4bL5ttr2310c2K"));
            assertTrue(e.getMessage().toLowerCase().contains("invalid character"));
        }

        @Test
        public void verifyCheckCharacters_InvalidCharacterAtEndModel()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("1987654Ad4X4bL5ttr2310\u00a32K"));
            assertTrue(e.getMessage().toLowerCase().contains("invalid character"));
        }

        @Test
        public void addCheckCharacters_InvalidCharacterAtEndModel()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> addCheckCharacters("1987654Ad4X4bL5ttr2310\u00a3"));
            assertTrue(e.getMessage().toLowerCase().contains("invalid character"));
        }

        @Test
        public void verifyCheckCharacters_InvalidCharacterAtCheck1()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("1987654Ad4X4bL5ttr2310cxK"));
            assertTrue(e.getMessage().toLowerCase().contains("invalid check character"));
        }

        @Test
        public void verifyCheckCharacters_InvalidCharacterAtCheck2()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("1987654Ad4X4bL5ttr2310c2x"));
            assertTrue(e.getMessage().toLowerCase().contains("invalid check character"));
        }

        @Test
        public void verifyCheckCharacters_TooShort()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("12345XX"));
            assertTrue(e.getMessage().toLowerCase().contains("too short"));
        }

        @Test
        public void verifyCheckCharacters_Shortest() throws Exception
        {
            assertTrue(verifyCheckCharacters("12345ANJ"));
        }

        @Test
        public void verifyCheckCharacters_TooLong()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharacters("123456789012345678901234XX"));
            assertTrue(e.getMessage().toLowerCase().contains("too long"));
        }


        @Test
        public void verifyCheckCharacters_Longest() throws Exception
        {
            assertTrue(verifyCheckCharacters("12345678901234567890123NT"));
        }

        @Test
        public void checkCharacters_TooShort()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> checkCharacters("12345"));
            assertTrue(e.getMessage().toLowerCase().contains("too short"));
        }

        @Test
        public void checkCharacters_Shortest() throws Exception
        {
            assertEquals("NJ",checkCharacters("12345A"));
        }

        @Test
        public void checkCharacters_TooLong()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> checkCharacters("123456789012345678901234"));
            assertTrue(e.getMessage().toLowerCase().contains("too long"));
        }

        @Test
        public void checkCharacters_Longest() throws Exception
        {
            assertEquals("NT",checkCharacters("12345678901234567890123"));
        }

        @Test
        public void verifyCheckCharacters_AllCSET82() throws Exception
        {
            // The aim here is to prevent regressions due to modifications of the CSET 82 characters
            assertTrue(verifyCheckCharacters("12345_ABCDEFGHIJKLMCP"));
            assertTrue(verifyCheckCharacters("12345_NOPQRSTUVWXYZDN"));
            assertTrue(verifyCheckCharacters("12345_abcdefghijklmN3"));
            assertTrue(verifyCheckCharacters("12345_nopqrstuvwxyzP2"));
            assertTrue(verifyCheckCharacters("12345_!\"%&'()*+,-./LC"));
            assertTrue(verifyCheckCharacters("12345_0123456789:;<=>?62"));
        }

        @Test
        public void verifyCheckCharacters_AllCSET32() throws Exception
        {
            // The aim here is to prevent regressions due to modifications of the CSET 32 characters
            assertTrue(verifyCheckCharacters("7907665Bm8v2AB"));
            assertTrue(verifyCheckCharacters("97850l6KZm0yCD"));
            assertTrue(verifyCheckCharacters("225803106GSpEF"));
            assertTrue(verifyCheckCharacters("149512464PM+GH"));
            assertTrue(verifyCheckCharacters("62577B8fRG7HJK"));
            assertTrue(verifyCheckCharacters("515942070CYxLM"));
            assertTrue(verifyCheckCharacters("390800494sP6NP"));
            assertTrue(verifyCheckCharacters("386830132uO+QR"));
            assertTrue(verifyCheckCharacters("53395376X1:nST"));
            assertTrue(verifyCheckCharacters("957813138Sb6UV"));
            assertTrue(verifyCheckCharacters("530790no0qOgWX"));
            assertTrue(verifyCheckCharacters("62185314IvwmYZ"));
            assertTrue(verifyCheckCharacters("23956qk1&dB!23"));
            assertTrue(verifyCheckCharacters("794394895ic045"));
            assertTrue(verifyCheckCharacters("57453Uq3qA<H67"));
            assertTrue(verifyCheckCharacters("0881063PhHvY89"));
        }

        @Test
        public void verifyCheckCharacters_MinimumIntermediateSum() throws Exception
        {
            assertTrue(verifyCheckCharacters("00000!HV"));
        }

        @Test
        public void verifyCheckCharacters_MaximumIntermediateSum() throws Exception
        {
            assertTrue(verifyCheckCharacters("99999zzzzzzzzzzzzzzzzzzT2"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_UsingExampleFromGenSpecs() throws Exception
        {
            assertTrue(verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2K"));
        }

        @Test
        public void checkCharactersGcpModel_UsingExampleFromGenSpecs() throws Exception
        {
            assertEquals("2K",checkCharactersGcpModel("1987654","Ad4X4bL5ttr2310c"));
        }

        @Test
        public void addCheckCharactersGcpModel_UsingExampleFromGenSpecs() throws Exception
        {
            assertEquals("1987654Ad4X4bL5ttr2310c2K", addCheckCharactersGcpModel("1987654","Ad4X4bL5ttr2310c"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_InvalidCheck1() throws Exception
        {
            assertFalse(verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","XK"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_InvalidCheck2() throws Exception
        {
            assertFalse(verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2X"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_CheckTooShort()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","3"));
            assertTrue(e.getMessage().toLowerCase().contains("check must be 2 characters long"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_CheckTooLong()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("1987654","Ad4X4bL5ttr2310c","2KX"));
            assertTrue(e.getMessage().toLowerCase().contains("check must be 2 characters long"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_GcpTooShort()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("1234","Ad4X4bL5ttr2310c","XX"));
            assertTrue(e.getMessage().toLowerCase().contains("gs1 company prefix is too short"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_GcpNotTooShort() throws Exception
        {
            assertTrue(verifyCheckCharactersGcpModelChecks("12345","Ad4X4bL5ttr2310c","66"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_GcpTooLong()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("1234567890123","Ad4X4bL5","XX"));
            assertTrue(e.getMessage().toLowerCase().contains("gs1 company prefix is too long"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_GcpNotTooLong() throws Exception
        {
            assertTrue(verifyCheckCharactersGcpModelChecks("123456789012","Ad4X4bL5ttr","3R"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_GcpNotNumeric()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("198765A","Ad4X4bL5ttr2310c","XX"));
            assertTrue(e.getMessage().toLowerCase().contains("gs1 company prefix must only contain digits"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_ModelEmpty()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("1987654","","3T"));
            assertTrue(e.getMessage().toLowerCase().contains("model reference must contain at least one character"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_OversizeShortestGCP()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("12345","6789012345678901234","XX"));
            assertTrue(e.getMessage().toLowerCase().contains("input is too long"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_NotOversizeShortestGCP() throws Exception
        {
            assertTrue(verifyCheckCharactersGcpModelChecks("12345","678901234567890123","NT"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_OversizeLongestGCP()
        {
            GS1Exception e = assertThrows(GS1Exception.class, () -> verifyCheckCharactersGcpModelChecks("123456789012","345678901234","XX"));
            assertTrue(e.getMessage().toLowerCase().contains("input is too long"));
        }

        @Test
        public void verifyCheckCharactersGcpModelChecks_NotOversizeLongestGCP() throws Exception
        {
            assertTrue(verifyCheckCharactersGcpModelChecks("123456789012","34567890123","NT"));
        }

}
