using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace GS1
{

    /// <summary>
    /// Helper class that is both a demonstration and usable implementation of a
    /// check character pair generator and verifier for a GS1 Global Model
    /// Number.
    ///
    /// Copyright (c) 2019-2021 GS1 AISBL.
    ///
    /// Licensed under the Apache License, Version 2.0 (the "License");
    /// you may not use this file except in compliance with the License.
    ///
    /// You may obtain a copy of the License at
    ///
    ///     http://www.apache.org/licenses/LICENSE-2.0
    ///
    /// Unless required by applicable law or agreed to in writing, software
    /// distributed under the License is distributed on an "AS IS" BASIS,
    /// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    /// See the License for the specific language governing permissions and
    /// limitations under the License.
    ///
    /// </summary>
    public static class GMN
    {

        /// <summary>
        /// Descending primes used as multipliers of each data character.
        /// </summary>
        private static readonly ushort[] weights = new ushort[] {83,79,73,71,67,61,59,53,47,43,41,37,31,29,23,19,17,13,11,7,5,3,2};

        /// <summary>
        /// GS1 AI encodable character set 82. Place in the string represents the character value.
        /// </summary>
        private const string cset82 = "!\"%&'()*+,-./0123456789:;<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

        /// <summary>
        /// Subset of the encodable character set used for the check character pair.
        /// </summary>
        private const string cset32 = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

        /// <summary>
        /// Character to value map for cset82.
        /// </summary>
        private static readonly IReadOnlyDictionary<char, ushort> cset82val;

        /// <summary>
        /// Character to value map for cset32.
        /// </summary>
        private static readonly IReadOnlyDictionary<char, ushort> cset32val;

        // Initialisation populates the cset82 and cset32 mappings
        static GMN()
        {
            IDictionary<char, ushort> tmp = new Dictionary<char, ushort>();
            for (ushort i = 0; i < cset82.Length; i++)
                tmp.Add(cset82[i], i);
            cset82val = new ReadOnlyDictionary<char, ushort>(tmp);

            tmp = new Dictionary<char, ushort>();
            for (ushort i = 0; i < cset32.Length; i++)
                tmp.Add(cset32[i], i);
            cset32val = new ReadOnlyDictionary<char, ushort>(tmp);
        }

        /// <summary>
        /// Calculates the check character pair for a given partial GMN.
        /// </summary>
        /// <param name="part">A partial GMN.</param>
        /// <returns>Check character pair.</returns>
        /// <exception cref="GS1Exception">If the format of the given GMN is invalid.</exception>
        public static string CheckCharacters(string part)
        {
            _FormatChecks(part, false);

            /*
             * The GMN check character pair calculation is performed here.
             *
             */

            // Characters are compared with the rightmost weights
            int offset = weights.Length - part.Length;

            // Sum the products of the character values and corresponding weights modulo 1021
            int sum = 0;
            for (int i = 0; i < part.Length; i++)
            {
                    ushort c = cset82val[ part[i] ];
                    ushort w = weights[ offset + i ];
                    sum += c * w;
            }
            sum %= 1021;

            // Check characters are the upper and lower 5 bits of the 10-bit sum
            return "" + cset32[sum >> 5] + cset32[sum & 31];

            // Equivalently, C1 = INT(sum/32); C2 = sum MOD 32
            // return "" + cset32[sum / 32] + cset32[sum % 32];

        }

        /// <summary>
        /// Calculates the check character pair for a given partial GMN, provided as GS1 Company Prefix and model reference components.
        /// </summary>
        /// <param name="gcp">A GS1 Company Prefix.</param>
        /// <param name="model">A model reference.</param>
        /// <returns>Check character pair.</returns>
        /// <exception cref="GS1Exception">If the format of the given GMN is invalid.</exception>
        public static string CheckCharactersGcpModel(string gcp, string model)
        {
            _FormatChecksGcpModel(gcp, model);
            return CheckCharacters(gcp + model);
        }

        /// <summary>
        /// Complete a given partial GMN by appending the check character pair.
        /// </summary>
        /// <param name="part">A partial GMN.</param>
        /// <returns>A complete GMN including the check character pair.</returns>
        /// <exception cref="GS1Exception">If the format of the given GMN is invalid.</exception>
        public static string AddCheckCharacters(string part)
        {
            return part + CheckCharacters(part);
        }

        /// <summary>
        /// Complete a given partial GMN, provided as GS1 Company Prefix and model reference components, by appending the check character pair.
        /// </summary>
        /// <param name="gcp">A GS1 Company Prefix.</param>
        /// <param name="model">A model reference.</param>
        /// <returns>A complete GMN including the check character pair.</returns>
        /// <exception cref="GS1Exception">If the format of the given GMN is invalid.</exception>
        public static string AddCheckCharactersGcpModel(string gcp, string model)
        {
            _FormatChecksGcpModel(gcp, model);
            return AddCheckCharacters(gcp + model);
        }

        /// <summary>
        /// Verify that a given GMN has a correct check character pair.
        /// </summary>
        /// <param name="gmn">A GMN.</param>
        /// <returns>True if the GMN is has a valid check character pair. Otherwise false.</returns>
        /// <exception cref="GS1Exception">If the format of the given GMN is invalid.</exception>
        public static bool VerifyCheckCharacters(string gmn)
        {
            _FormatChecks(gmn, true);

            // Split off the provided check character pair, recalculate them and ensure that they match
            string part = gmn.Substring(0, gmn.Length - 2);
            string suppliedChecks = gmn.Substring(gmn.Length - 2, 2);

            return CheckCharacters(part).Equals(suppliedChecks);
        }

        /// <summary>
        /// Verify that a given GMN, provided as GS1 Company Prefix, model reference and check character components, has a correct check character pair.
        /// </summary>
        /// <param name="gcp">A GS1 Company Prefix.</param>
        /// <param name="model">A model reference.</param>
        /// <param name="checks">A check character pair.</param>
        /// <returns>True if the GMN is has a valid check character pair. Otherwise false.</returns>
        /// <exception cref="GS1Exception">If the format of the given GMN is invalid.</exception>
        public static bool VerifyCheckCharactersGcpModelChecks(string gcp, string model, string checks)
        {
            _FormatChecksGcpModelChecks(gcp, model, checks);
            return VerifyCheckCharacters(gcp + model + checks);
        }

        /// <summary>
        /// Indicate whether each character in a given GMN belongs to the appropriate character set for the character position.
        /// </summary>
        /// <param name="gmn">A GMN.</param>
        /// <param name="complete">true if a GMN is being provided complete with a check character pair. Otherwise false.</param>
        /// <returns>a boolean array matching each input character: true if the character belongs to the appropriate set. Otherwise false.</returns>
        public static bool[] GoodCharacterPositions(string gmn, bool complete)
        {
            bool[] ret = new bool[gmn.Length];
            for (int i = 0; i < gmn.Length; i++)
            {

                // GMN begins with a GS1 Company Prefix which is at least five characters
                if (i < 5)
                    ret[i] = Char.IsDigit(gmn[i]);
                else if (!complete || i < gmn.Length - 2)
                    ret[i] = cset82val.ContainsKey(gmn[i]);
                else  // For a complete GMN final two positions are check character pair
                    ret[i] = cset32val.ContainsKey(gmn[i]);

            }
            return ret;
        }

        /// <summary>
        /// Indicate whether each character in a given GMN, provided as GS1 Company Prefix, model reference and check character components, belongs to the appropriate character set for the character position.
        /// </summary>
        /// <param name="gcp">A GS1 Company Prefix.</param>
        /// <param name="model">A model reference.</param>
        /// <param name="checks">A check character pair.</param>
        /// <returns>a boolean array matching each input character: true if the character belongs to the appropriate set. Otherwise false.</returns>
        public static bool[] GoodCharacterPositionsGcpModelChecks(string gcp, string model, string checks)
        {
            bool[] ret = GoodCharacterPositions(gcp + model + checks, true);

            // The GS1 Company Prefix is numeric only
            for (int i = 0; i < gcp.Length; i++)
                ret[i] = Char.IsDigit(gcp[i]);

            return ret;
        }

        /// <summary>
        /// Indicate whether each character in a given GMN, provided as GS1 Company Prefix and model reference components, belongs to the appropriate character set for the character position.
        /// </summary>
        /// <param name="gcp">A GS1 Company Prefix.</param>
        /// <param name="model">A model reference.</param>
        /// <returns>a boolean array matching each input character: true if the character belongs to the appropriate set. Otherwise false.</returns>
        public static bool[] GoodCharacterPositionsGcpModel(string gcp, string model)
        {
            bool[] ret = GoodCharacterPositions(gcp + model, false);

            // The GS1 Company Prefix is numeric only
            for (int i = 0; i < gcp.Length; i++)
                ret[i] = Char.IsDigit(gcp[i]);

            return ret;
        }

        // Perform some local consistency checks on a partial or complete GMN string
        private static void _FormatChecks(string input, bool complete)
        {
            int maxLength = complete ? weights.Length + 2 : weights.Length;
            int minLength = complete ? 8 : 6;

            // Verify overall length
            if (input.Length < minLength)
                throw new GS1Exception("The input is too short. It should be at least " + minLength + " characters long" + ( complete ? "." : " excluding the check character pair." ) );
            if (input.Length > maxLength)
                throw new GS1Exception("The input is too long. It should be " + maxLength + " characters maximum" + ( complete ? "." : " excluding the check character pair." ) );

            // Verify that the content is in the correct encodable character set
            bool[] goodCharacters = GoodCharacterPositions(input, complete);
            for (int i = 0; i < input.Length; i++)
            {

                if (!goodCharacters[i])
                {
                    if (i < 5)
                        throw new GS1Exception("GMN starts with the GS1 Company Prefix. At least the first five characters must be digits.");
                    else if (!complete || i < input.Length - 2)
                        throw new GS1Exception("Invalid character at position " + (i + 1) + ": " + input[i]);
                    else
                        throw new GS1Exception("Invalid check character at position " + (i + 1) + ": " + input[i]);
                }
            }

            return;
        }

        // Perform some local consistency checks on the input provided as GS1 Company Prefix and model reference
        private static void _FormatChecksGcpModel(string gcp, string model)
        {
            _FormatChecksGcpModelChecks(gcp, model, null);
        }

        // Perform some local consistency checks on the input provided as GS1 Company Prefix, model reference and check characters
        private static void _FormatChecksGcpModelChecks(string gcp, string model, string checks)
        {

            // Verify that the GS1 Company Prefix has the correct length
            if (gcp.Length < 5)
                throw new GS1Exception("The GS1 Company Prefix is too short. It should be at least 5 digits long.");
            if (gcp.Length > 12)
                throw new GS1Exception("The GS1 Company Prefix is too long. It should not be more than 12 digits long.");

            // Verify that the model reference contains at least one character
            if (model.Length < 1)
                throw new GS1Exception("The model reference must contain at least one character.");

            // Verify that the GS1 Company Prefix is numeric only
            bool[] goodCharacters = GoodCharacterPositionsGcpModel(gcp, model);
            for (int i = 0; i < gcp.Length; i++)
                if (!goodCharacters[i])
                    throw new GS1Exception("The GS1 Company Prefix must only contain digits.");

            // If given, verify that the check is the correct length
            if (checks != null && checks.Length != 2)
               throw new GS1Exception("The check must be 2 characters long.");

            // Perform more format checks on the overall GMN
            if (checks == null)
                _FormatChecks(gcp + model, false);
            else
                _FormatChecks(gcp + model + checks, true);

            return;
        }

    }


    /// <summary>
    /// A custom exception class to differentiate exceptions raised by the utility
    /// class from other sources of error.
    /// </summary>
    public class GS1Exception : Exception
    {
        /// <summary>
        /// Error constructor.
        /// </summary>
        /// <param name="message">
        /// Description of the error.
        /// </param>
        public GS1Exception(string message)
           : base(message)
        {
        }
    }

}
