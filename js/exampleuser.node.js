/*
 * Example user of the helper library.
 *
 * The associated library is a check character generator and verifier for a GS1
 * Global Model Number.
 *
 * Copyright (c) 2019-2023 GS1 AISBL.
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
 */

"use strict";

const GMN = require('./gmn');

const fs = require('node:fs');
const readline = require('node:readline/promises');


/*
 * Terse demonstration of processing commandline input provided by the user
 *
 */
function processUserInput(args)
{

    args.shift();
    args.shift();

    if (args.length != 2 || ((args[0] !== "verify") && (args[0] !== "complete")))
    {
        console.log("\nIncorrect arguments.\n");
        console.log("Usage: node exampleuser.node.js {verify|complete} gmn_data\n");
        process.exit(1);
    }

    try
    {
        if (args[0] === "verify")
        {
            var valid = GMN.verifyCheckCharacters(args[1]);
            console.log("The check characters are " + (valid ? "valid" : "NOT valid"));
            process.exit(valid ? 0:1);
        }
        else   // complete
        {
            console.log(GMN.addCheckCharacters(args[1]));
            process.exit(0);
        }
    }
    catch (e)
    {
        console.error("Error: " + e);
        process.exit(1);
    }

}


/*
 *  Main starts here
 *
 */
async function main()
{


    /*
     * User has provided commandline arguments. We tuck this code out of
     * the way for clarity and demonstrate some simpler cases first.
     *
     */
    if (process.argv.length > 2)
        processUserInput(process.argv);


    /*
     * Non-interactive demonstration
     *
     */
    console.log("\nOutput from non-interactive demonstration");
    console.log("*****************************************\n");

    var gmn;
    var partialGMN;
    var complete;
    var checkCharacters;
    var valid;

    /*
     * Example: GMN.verifyCheckCharacters
     *
     * Verifying the check characters of a GMN.
     *
     */
    try
    {

        gmn = "1987654Ad4X4bL5ttr2310c2K";      // Valid GMN based on example from the Gen Specs
        // gmn = "1987654Ad4X4bL5ttr2310cZZ";   // Invalid: Bad check digits

        // Examples that raise exceptions:
        //
        // gmn = "1987654Ad4X4bL5ttr2310c2KZ";  // Exception: Too long
        // gmn = "12345AB";                     // Exception: Too short
        // gmn = "ABC7654Ad4X4bL5ttr2310cZZ";   // Exception: Doesn't start with five digits
        // gmn = "12345£££d4X4bL5ttr2310cZZ";   // Exception: Contains characters outside of CSET 82

        /* Call the GMN.verifyCheckCharacters helper */
        valid = GMN.verifyCheckCharacters(gmn);

        if (valid)
        {
            console.log("This GMN has correct check characters: " + gmn);
        }
        else
        {
            console.log("This GMN has incorrect check characters: " + gmn);
        }
        console.log();

    }
    catch (e)
    {
        console.error("Something went wrong: " + e);
        process.exit(1);
    }


    /*
     * Example: GMN.addCheckCharacters
     *
     * Adding the check characters to an incomplete GMN.
     *
     */
    try
    {

        partialGMN = "1987654Ad4X4bL5ttr2310c";      // Based on example from the Gen Specs

        // Examples that raise exceptions:
        //
        // partialGMN = "1987654Ad4X4bL5ttr2310cX";  // Exception: Too long
        // partialGMN = "12345";                     // Exception: Too short
        // partialGMN = "ABC7654Ad4X4bL5ttr2310c";   // Exception: Doesn't start with five digits
        // partialGMN = "12345£££d4X4bL5ttr2310c";   // Exception: Contains characters outside of CSET 82

        /* Call the GMN.addCheckCharacters helper */
        gmn = GMN.addCheckCharacters(partialGMN);

        console.log("Partial:  " + partialGMN);
        console.log("Full GMN: " + gmn);
        console.log();

    }
    catch (e)
    {
        console.error("Something went wrong: "+e);
        process.exit(1);
    }


    /*
     * Example: GMN.checkCharacters
     *
     * Returning just the check characters, then completing the GMN
     *
     */
    try
    {

        partialGMN = "1987654Ad4X4bL5ttr2310c";      // Based on example from the Gen Specs

        /* Call the GMN.checkCharacters helper */
        checkCharacters = GMN.checkCharacters(partialGMN);

        console.log("Partial:  " + partialGMN);
        console.log("Checks:   " + checkCharacters);

        // Contatenate to produce the complete GMN
        gmn = partialGMN + checkCharacters;
        console.log("Full GMN: " + gmn);

        console.log();

    }
    catch (e)
    {
        console.error("Something went wrong: " + e);
        process.exit(1);
    }


    /*
     * Interactive demonstration
     *
     */
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});

    console.log("\nInteractive demonstration");
    console.log("*************************");

    for (;;)
    {

        console.log("\nPlease select an option:\n");
        console.log("  c  - Complete a partial GMN by adding check digits");
        console.log("  v  - Verify the check digits of a complete GMN");
        console.log("  cf - Complete partial GMNs supplied on each line of a file");
        console.log("  vf - Verify complete GMNs supplied on each line of a file");
        console.log("  q  - Quit");

        const opt = await rl.question("\nEnter option (c/v/cf/vf/q)? ");

        // Quit
        if (opt === "q")
            break;

        // Verify a GMN
        if (opt ===  "v")
        {
            try
            {
                gmn = await rl.question("\nPlease supply a GMN to verify: ");
                valid = GMN.verifyCheckCharacters(gmn);
                console.log("Outcome: " + (valid ? "*** Valid ***" : "*** Not valid ***") );
            }
            catch (e)
            {
                console.log("Error with input: " + e);
            }
            continue;
        }

        // Complete a partial GMN
        if (opt === "c")
        {
            try
            {
                gmn = await rl.question("\nPlease supply a partial GMN to complete: ");
                complete = GMN.addCheckCharacters(gmn);
                console.log("Complete GMN: " + complete);
            }
            catch (e)
            {
                console.log("Error with input: " + e);
            }
            continue;
        }

        // Operations line by line on a file
        if (opt === "cf" || opt === "vf")
        {
            try
            {
                var filename = await rl.question("\nPlease supply a filename: ");
                fs.readFileSync(filename).toString().match(/^.+$/gm).forEach(function (line) {
                    var out;
                    try
                    {
                        if (opt === "cf")
                        {
                            out = GMN.checkCharacters(line);
                        }
                        else
                        {  // vf
                            out = GMN.verifyCheckCharacters(line) ? "*** Valid ***" : "*** Not valid ***";
                        }
                    }
                    catch (e)
                    {
                        out = e;
                    }
                    console.log(line + " : " + out);
                });
            }
            catch (e)
            {
                console.log(e);
            }
            continue;
        }

    }

    rl.close();

}


main();

