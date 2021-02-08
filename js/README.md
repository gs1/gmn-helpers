GMN JavaScript Helper Library
=============================

This contains an official JavaScript helper library provided by GS1 for check
character pair generation and verification of a Global Model Number (GMN).


Artifacts
---------

| Asset                 | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| gmn.js                | The helper library                                                 |
| docs/index.html       | Documentation describing the library's API                         |
| gmn.test.js           | Unit tests for the helper compatible with Jest                     |
| exampleuser.html      | Example code providing a HTML page that uses the library           |
| exampleuser.node.js   | Example code providing a Node.js application that uses the library |


Using the helper library
------------------------

For use within client-side JavaScript of a web page, the gmn.js
file should be copied into your web root and referenced via a HTML script tag:

    <script src="js/gmn.js"></script>

For use within a Node.js application, the gmn.js file can be
referenced via a require statement:

    const GMN = require('./gmn');

Alternatively, you could examine the source code then create your own
specialised implementation. In this case you should apply the unit tests to
your own code as a means of detecting errors.


Documentation
-------------

HTML documentation of the API is included in this distribution: docs/index.html


Running the example web page
----------------------------

Simply open the exampleuser.html file using your JavaScript-enabled web
browser.


Running the example Node.js application
---------------------------------------

From this directory:

    npm install readline-sync
    node exampleuser.node.js

When the example application is run without command line arguments it will
display the output of some trivial non-interactive library operations on static
data. It will then enter an interactive mode in which it prompts the user for
an activity to perform and then the data or file to perform the given activity
on.

Additionally, the example application can be called with command line arguments
in which case it will serve as a basic check character pair generation and
verification utility:

    $ node exampleuser.node.js complete 1987654Ad4X4bL5ttr2310c
    1987654Ad4X4bL5ttr2310c2K

    $ node exampleuser.node.js verify 1987654Ad4X4bL5ttr2310c2K
    The check characters are valid

    $ node exampleuser.node.js verify 1987654Ad4X4bL5ttr2310cXX
    The check characters are NOT valid


Running the unit tests
----------------------

If you have modified the helper then you should run the tests using Jest.

From this directory:

    npm install -g jest-cli
    jest


Regenerating the documentation
-------------------------------

Documentation can be regenerated using JSDoc.

From this source directory:

    npm install -g jsdoc
    jsdoc -d docs gmn.js
