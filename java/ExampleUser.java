/*
 * Global Model Number check digit generator and verifier example user.
 *
 * The associated library is a check character generator and verifier for a GS1
 * Global Model Number.
 *
 * Copyright (c) 2019-2021 GS1 AISBL.
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

import org.gs1.*;  // Include the GS1 libraries

import java.util.Scanner;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

class ExampleUser
{

    public static void main(String[] args)
    {

        /*
	 * User has provided commandline arguments. We tuck this code out of
	 * the way for clarity and demonstrate some simpler cases first.
         *
         */
        if (args.length > 0)
            processUserInput(args);


        /*
         * Non-interactive demonstration
         *
         */
        System.out.println("\nOutput from non-interactive demonstration");
        System.out.println("*****************************************\n");

        /*
         * Example: org.gs1.GMN.verifyCheckCharacters
         *
         * Verifying the check characters of a GMN.
         *
         */
        try
        {

            String gmn = "1987654Ad4X4bL5ttr2310c2K";      // Valid GMN based on example from the Gen Specs
            // String gmn = "1987654Ad4X4bL5ttr2310cZZ";   // Invalid: Bad check digits

            // Examples that raise exceptions:
            //
            // String gmn = "1987654Ad4X4bL5ttr2310c2KZ";  // Exception: Too long
            // String gmn = "12345AB";                     // Exception: Too short
            // String gmn = "ABC7654Ad4X4bL5ttr2310cZZ";   // Exception: Doesn't start with five digits
            // String gmn = "12345£££d4X4bL5ttr2310cZZ";   // Exception: Contains characters outside of CSET 82

            /* Call the org.gs1.GMN.verifyCheckCharacters helper */
            boolean valid = GMN.verifyCheckCharacters(gmn);

            if (valid)
            {
                System.out.println("This GMN has correct check characters: " + gmn);
            }
            else
            {
                System.out.println("This GMN has incorrect check characters: " + gmn);
            }
            System.out.println();

        }
        catch (GS1Exception e)
        {
            System.err.println("Something went wrong: " + e.getMessage());
            System.exit(1);
        }


        /*
         * Example: org.gs1.GMN.addCheckCharacters
         *
         * Adding the check characters to an incomplete GMN.
         *
         */
        try
        {

            String partialGMN = "1987654Ad4X4bL5ttr2310c";      // Based on example from the Gen Specs

            // Examples that raise exceptions:
            //
            // String partialGMN = "1987654Ad4X4bL5ttr2310cX";  // Exception: Too long
            // String partialGMN = "12345";                     // Exception: Too short
            // String partialGMN = "ABC7654Ad4X4bL5ttr2310c";   // Exception: Doesn't start with five digits
            // String partialGMN = "12345£££d4X4bL5ttr2310c";   // Exception: Contains characters outside of CSET 82

            /* Call the org.gs1.GMN.addCheckCharacters helper */
            String gmn = GMN.addCheckCharacters(partialGMN);

            System.out.println("Partial:  " + partialGMN);
            System.out.println("Full GMN: " + gmn);
            System.out.println();

        }
        catch (GS1Exception e)
        {
            System.err.println("Something went wrong: "+e.getMessage());
            System.exit(1);
        }


        /*
         * Example: org.gs1.GMN.checkCharacters
         *
         * Returning just the check characters, then completing the GMN
         *
         */
        try
        {

            String partialGMN = "1987654Ad4X4bL5ttr2310c";      // Based on example from the Gen Specs

            /* Call the org.gs1.GMN.checkCharacters helper */
            String checkCharacters = GMN.checkCharacters(partialGMN);

            System.out.println("Partial:  " + partialGMN);
            System.out.println("Checks:   " + checkCharacters);

            // Contatenate to produce the complete GMN
            String gmn = partialGMN + checkCharacters;
            System.out.println("Full GMN: " + gmn);

            System.out.println();

        }
        catch (GS1Exception e)
        {
            System.err.println("Something went wrong: " + e.getMessage());
            System.exit(1);
        }


        /*
         * Interactive demonstration
         *
         */
        System.out.println("\nInteractive demonstration");
        System.out.println("*************************");

        Scanner scanner = new Scanner(System.in);

        while (true) {

            System.out.println("\nPlease select an option:\n");
            System.out.println("  c  - Complete a partial GMN by adding check digits");
            System.out.println("  v  - Verify the check digits of a complete GMN");
            System.out.println("  cf - Complete partial GMNs supplied on each line of a file");
            System.out.println("  vf - Verify complete GMNs supplied on each line of a file");
            System.out.println("  q  - Quit");
            System.out.print("\nEnter option (c/v/cf/vf/q)? ");
            String opt = scanner.nextLine();

            // Quit
            if (opt.equals("q"))
                break;

            // Verify a GMN
            if (opt.equals("v"))
            {
                try
                {
                    System.out.print("\nPlease supply a GMN to verify: ");
                    String gmn = scanner.nextLine();
                    boolean valid = GMN.verifyCheckCharacters(gmn);
                    System.out.println("Outcome: " + (valid ? "*** Valid ***" : "*** Not valid ***") );
                }
                catch (GS1Exception e)
                {
                    System.out.println("Error with input: " + e.getMessage());
                }
                continue;
            }

            // Complete a partial GMN
            if (opt.equals("c"))
            {
                try
                {
                    System.out.print("\nPlease supply a partial GMN to complete: ");
                    String gmn = scanner.nextLine();
                    String complete = GMN.addCheckCharacters(gmn);
                    System.out.println("Complete GMN: " + complete);
                }
                catch (GS1Exception e)
                {
                    System.out.println("Error with input: " + e.getMessage());
                }
                continue;
            }

            // Operations line by line on a file
            if (opt.equals("cf") || opt.equals("vf"))
            {
                try
                {
                    System.out.print("\nPlease supply a filename: ");
                    String filename = scanner.nextLine();
                    BufferedReader reader = new BufferedReader(new FileReader(filename));
                    String in, out;
                    while ( (in = reader.readLine()) != null )
                    {
                        try
                        {
                            if (opt.equals("cf"))
                            {
                                out = GMN.checkCharacters(in);
                            }
                            else
                            {  // vf
                                out = GMN.verifyCheckCharacters(in) ? "*** Valid ***" : "*** Not valid ***";
                            }
                        }
                        catch (GS1Exception e)
                        {
                            out = e.getMessage();
                        }
                        System.out.println(in + " : " + out);
                    }
                    reader.close();
                }
                catch (IOException e)
                {
                    System.out.println(e.getMessage());
                }
                continue;
            }

        }

        return;

    }


    /*
     * Terse demonstration of processing commandline input provided by the user
     *
     */
    private static void processUserInput(String args[]) {

        if (args.length != 2 || (!args[0].equals("verify") && !args[0].equals("complete"))) {
            System.out.println("\nIncorrect arguments.\n");
            System.out.println("Usage: java ExampleUser {verify|complete} gmn_data\n");
            System.exit(1);
        }

        try
        {
            if (args[0].equals("verify"))
            {
                boolean valid=GMN.verifyCheckCharacters(args[1]);
                System.out.println("The check characters are " + (valid ? "valid" : "NOT valid"));
                System.exit(valid ? 0:1);
            }
            else   // complete
            {
                System.out.println(GMN.addCheckCharacters(args[1]));
                System.exit(0);
            }
        }
        catch (GS1Exception e)
        {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }

    }

}
