/**
 * Helper module that is both a demonstration and usable implementation of a
 * check character pair generator and verifier for a GS1 Global Model Number.
 *
 * @author Copyright (c) 2019-2021 GS1 AISBL.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @namespace GMN
 *
 */
var GMN = (function () {

    "use strict";

    /**
     * Descending primes used as multipliers of each data character.
     * @private
     */
    var weights =
        [ 83,79,73,71,67,61,59,53,47,43,41,37,31,29,23,19,17,13,11,7,5,3,2 ];

    /**
     * GS1 AI encodable character set 82. Place in the string represents the
     * character value.
     * @private
     */
    var cset82 =
        "!\"%&'()*+,-./0123456789:;<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "_abcdefghijklmnopqrstuvwxyz";

    /**
     * Subset of the encodable character set used for check character pairs.
     * @private
     */
    var cset32 = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

    /**
     * Character to value map for cset82.
     * @private
     */
    var cset82value = {};
    var i;
    for (i = 0; i < cset82.length; i++)
        cset82value[ cset82[i] ] = i;

    /**
     * Character to value map for cset32.
     * @private
     */
    var cset32value = {};
    for (i = 0; i < cset32.length; i++)
        cset32value[ cset32[i] ] = i;

    /**
     * Calculates the check character pair for a given partial GMN.
     *
     * @memberof GMN
     * @param {string} part a partial GMN.
     * @return {string} check character pair.
     * @throws Will throw error if the format of the given GMN is invalid.
     */
    var checkCharacters = function (part)
    {
        _formatChecks(part, false);

        /*
         * The GMN check character pair calculation is performed here.
         *
         */

        // Characters are compared with the rightmost weights
        var offset = weights.length - part.length;

        // Modulo 1021 sum of the products of the character values and their
        // corresponding weights
        var sum = 0;
        for (var i = 0; i < part.length; i++)
        {
                var c = cset82value[ part[i] ];
                var w = weights[ offset + i ];
                sum += c * w;
        }
        sum %= 1021;

        // Split the 10-bit sum over two five-bit check characters
        return "" + cset32[ Math.floor(sum / 32) ] + cset32[ sum % 32 ];
    };

    /**
     * Calculates the check character pair for a given partial GMN, provided as GS1 Company Prefix and model reference components.
     *
     * @memberof GMN
     * @param {string} gcp a GS1 Company Prefix.
     * @param {string} model a model reference.
     * @return {string} check character pair.
     * @throws Will throw error if the format of the given GMN is invalid.
     */
    var checkCharactersGcpModel = function (gcp, model)
    {
        _formatChecksGcpModel(gcp, model);
        return checkCharacters(gcp + model);
    };

    /**
     * Complete a given partial GMN by appending the check character pair.
     *
     * @memberof GMN
     * @param {string} part a partial GMN.
     * @return {string} a complete GMN including the check character pair.
     * @throws Will throw error if the format of the given GMN is invalid.
     */
    var addCheckCharacters = function (part)
    {
        return part + checkCharacters(part);
    };

    /**
     * Complete a given partial GMN, provided as GS1 Company Prefix and model reference components, by appending the check character pair.
     *
     * @memberof GMN
     * @param {string} gcp a GS1 Company Prefix.
     * @param {string} model a model reference.
     * @return {string} a complete GMN including the check character pair.
     * @throws Will throw error if the format of the given GMN is invalid.
     */
    var addCheckCharactersGcpModel = function (gcp, model)
    {
        _formatChecksGcpModel(gcp, model);
        return addCheckCharacters(gcp + model);
    };

    /**
     * Verify that a given GMN has a correct check character pair.
     *
     * @memberof GMN
     * @param {string} gmn a GMN.
     * @return {boolean} true if the GMN is has a valid check character pair. Otherwise false.
     * @throws Will throw error if the format of the given GMN is invalid.
     */
    var verifyCheckCharacters = function (gmn)
    {
        _formatChecks(gmn, true);

        // Split off the provided check character pair, recalculate them and ensure
        // that they match
        var part = gmn.substring(0, gmn.length - 2);
        var suppliedChecks = gmn.substring(gmn.length - 2, gmn.length);

        return checkCharacters(part) === suppliedChecks;
    };

    /**
     * Verify that a given GMN, provided as GS1 Company Prefix, model reference and check character components, has a correct check character pair.
     *
     * @memberof GMN
     * @param {string} gcp a GS1 Company Prefix.
     * @param {string} model a model reference.
     * @param {string} checks a check character pair.
     * @return {boolean} true if the GMN has a valid check character pair. Otherwise false.
     * @throws Will throw error if the format of the given GMN is invalid.
     */
    var verifyCheckCharactersGcpModelChecks = function (gcp, model, checks)
    {
        _formatChecksGcpModelChecks(gcp, model, checks);
        return verifyCheckCharacters(gcp + model + checks);
    };

    /**
     * Indicate whether each character in a given GMN belongs to the appropriate character set for the character position.
     *
     * @memberof GMN
     * @param {string} gmn a full or partial GMN.
     * @param {boolean} complete true if a GMN is being provided complete with a check character pair. Otherwise false.
     * @return {boolean[]} a boolean array matching each input character: true if the character belongs to the appropriate set. Otherwise false.
     */
    var goodCharacterPositions = function (gmn, complete)
    {
        var out = [];
        for (var i = 0; i < gmn.length; i++)
        {

            // GMN begins with a GS1 Company Prefix which is at least five characters
            if (i < 5)
                out[i] = "0123456789".indexOf( gmn[i] ) != -1;
            else if (!complete || i < gmn.length - 2)
                out[i] = typeof cset82value[ gmn[i] ] !== "undefined";
            else  // For a complete GMN final two positions are check character pair
                out[i] = typeof cset32value[ gmn[i] ] !== "undefined";

        }
        return out;
    };

    /**
     * Indicate whether each character in a given GMN, provided as GS1 Company Prefix, model reference and check character components, belongs to the appropriate character set for the character position.
     *
     * @memberof GMN
     * @param {string} gcp a GS1 Company Prefix.
     * @param {string} model a model reference.
     * @param {string} checks a check character pair.
     * @return {boolean[]} a boolean array matching each input character: true if the character belongs to the appropriate set. Otherwise false.
     */
    var goodCharacterPositionsGcpModelChecks = function (gcp, model, checks)
    {
        var out = goodCharacterPositions(gcp + model + checks, true);

        // The GS1 Company Prefix is numeric only
        var i;
        for (i = 0; i < gcp.length; i++)
            out[i] = "0123456789".indexOf( gcp[i] ) != -1;

        // Define all characters of the GS1 Company Prefix to be bad if the length is incorrect
        if (gcp.length < 5 || gcp.length > 12)
            for (i = 0; i < gcp.length; i++)
                out[i] = false;

        return out;
    };

    /**
     * Indicate whether each character in a partial GMN, provided as GS1 Company Prefix and model reference components, belongs to the appropriate character set for the character position.
     *
     * @memberof GMN
     * @param {string} gcp a GS1 Company Prefix.
     * @param {string} model a model reference.
     * @return {boolean[]} a boolean array matching each input character: true if the character belongs to the appropriate set. Otherwise false.
     */
    var goodCharacterPositionsGcpModel = function (gcp, model)
    {
        var out = goodCharacterPositions(gcp + model, false);

        // The GS1 Company Prefix is numeric only
        var i;
        for (i = 0; i < gcp.length; i++)
            out[i] = "0123456789".indexOf( gcp[i] ) != -1;

        // Define all characters of the GS1 Company Prefix to be bad if the length is incorrect
        if (gcp.length < 5 || gcp.length > 12)
            for (i = 0; i < gcp.length; i++)
                out[i] = false;

        return out;
    };

    // Perform some local consistency checks on a partial or complete GMN string
    var _formatChecks = function (input, complete) {
        var maxLength = complete ? weights.length + 2 : weights.length;
        var minLength = complete ? 8 : 6;

        // Verify overall length
        if (input.length < minLength)
            throw "The input is too short. It should be at least " + minLength + " characters long" + ( complete ? "." : " excluding the check character pair." );
        if (input.length > maxLength)
            throw "The input is too long. It should be " + maxLength + " characters maximum" + ( complete ? "." : " excluding the check character pair." );

        // Verify that the content is in the correct encodable character set
        var goodCharacters = goodCharacterPositions(input, complete);
        for (var i = 0; i < input.length; i++)
        {

            if (!goodCharacters[i])
            {
                if (i < 5)
                    throw "GMN starts with the GS1 Company Prefix. At least the first five characters must be digits.";
                else if (!complete || i < input.length - 2)
                    throw "Invalid character at position " + (i + 1) + ": " + input[i];
                else
                    throw "Invalid check character at position " + (i + 1) + ": " + input[i];
            }

        }
    };

    // Perform some local consistency checks on the input provided as GS1 Company Prefix and model reference
    var _formatChecksGcpModel = function (gcp, model) {
        _formatChecksGcpModelChecks(gcp, model, null);
    }

    // Perform some local consistency checks on the input provided as GS1 Company Prefix, model reference and check characters
    var _formatChecksGcpModelChecks = function (gcp, model, checks) {

        // Verify that the GS1 Company Prefix has the correct length
        if (gcp.length < 5)
            throw "The GS1 Company Prefix is too short. It should be at least 5 digits long.";
        if (gcp.length > 12)
            throw "The GS1 Company Prefix is too long. It should not be more than 12 digits long.";

        // Verify that the model reference contains at least one character
        if (model.length < 1)
            throw "The model reference must contain at least one character.";

        // Verify that the GS1 Company Prefix is numeric only
        var goodCharacters = goodCharacterPositionsGcpModel(gcp, model);
        for (var i = 0; i < gcp.length; i++)
            if (!goodCharacters[i])
                throw "The GS1 Company Prefix must only contain digits.";

        // If given, verify that the check is the correct length
        if (checks != null && checks.length != 2)
           throw "The check must be 2 characters long.";

        // Perform more format checks on the overall GMN
        if (checks == null)
            _formatChecks(gcp + model, false);
        else
            _formatChecks(gcp + model + checks, true);

    }

    return {
        verifyCheckCharacters: verifyCheckCharacters,
        verifyCheckCharactersGcpModelChecks: verifyCheckCharactersGcpModelChecks,
        checkCharacters: checkCharacters,
        checkCharactersGcpModel: checkCharactersGcpModel,
        addCheckCharacters: addCheckCharacters,
        addCheckCharactersGcpModel: addCheckCharactersGcpModel,
        goodCharacterPositions: goodCharacterPositions,
        goodCharacterPositionsGcpModel: goodCharacterPositionsGcpModel,
        goodCharacterPositionsGcpModelChecks: goodCharacterPositionsGcpModelChecks,
    };

})();


// For node.js
try {
   module.exports = exports = GMN;
} catch (e) {}

