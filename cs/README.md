GMN C# Helper Library
=====================

This contains an official C# helper library provided by GS1 for check character
pair generation and verification of a GS1 Global Model Number (GMN).

Artifacts
---------

| Asset                          | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| GMN.[version].nupkg            | The helper library packaged as a .NET Standard 2.0 NuGet             |
| docs/index.html                | Documentation describing the library's API                           |
| GMN/                           | Source code for the utility class that implements the helper library |
| GMNTests/                      | Unit tests for the utility class compatible with xUnit.NET           |
| ExampleUser/                   | Example code providing a simple application that uses the library    |


Using the helper library
------------------------

The NuGet package can be placed in your local or organisational package
repository and configured as a dependancy of your solution.

Alternatively, the source code for the utility class can be vendored in to your
solution's source code.

Finally, you could examine the source code then create your own specialised
implementation.  In this case you should apply the unit tests to your own code
as a means of detecting errors. The unit tests are generalised to make this
easy provided that you use matching method names.


Documentation
-------------

HTML documentation of the API is included in this distribution: docs/index.html


Building the helper library
---------------------------

This distribution contains a .sln file compatible with Visual Studio 2017 or
later or MSBuild 15 or later.

From this source directory:

    dotnet build GS1GMN.sln

If you have modified the class then you should run the tests using xUnit.NET:

    dotnet test GS1GMN.sln


Running the example application
-------------------------------

From this source directory:

    dotnet publish -o app GS1GMN.sln
    cd app/
    dotnet ExampleUser.dll

When the example application is run without command line arguments it will
display the output of some trivial non-interactive library operations on static
data. It will then enter an interactive mode in which it prompts the user for
an activity to perform and then the data or file to perform the given activity
on.

Additionally, the example application can be called with command line arguments
in which case it will serve as a basic check character pair generation and
verification utility:

    $ dotnet ExampleUser.dll complete 1987654Ad4X4bL5ttr2310c
    1987654Ad4X4bL5ttr2310c2K

    $ dotnet ExampleUser.dll verify 1987654Ad4X4bL5ttr2310c2K
    The check characters are valid

    $ dotnet ExampleUser.dll verify 1987654Ad4X4bL5ttr2310cXX
    The check characters are NOT valid


Recreating the package
----------------------

From this source directory:

    dotnet pack -c Release -o app GMN/GMN.csproj
    cp app/GMN.*.nupkg .


Regenerating the documentation
-------------------------------

Documentation is created as part of a standard build but can be regenerated
specifically.

From this source directory:

    msbuild docfx_project/docfx_project.csproj
