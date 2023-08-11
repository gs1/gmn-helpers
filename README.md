GS1 Global Model Number Helper Libraries
========================================

The GS1 GMN Helper Libraries is an open source project that contains a set of
official helper libraries written by GS1 for check character pair generation
and verification of a GS1 Global Model Number (GMN).

**Note**: With the GS1 General Specification Release 21.0 in January 2021, this
library is suitable for all uses of the Global Model Number. This includes use
for Regulated Healthcare medical devices that fall under the EU regulations EU
MDR 2017/745 and EU IVDR 2017/746, specifically when a GMN is used as the
embodiment of a Basic UDI-DI.


Check Character Generation and Validation
-----------------------------------------

The GS1 Global Model Number uses an error detection algorithm that is unlike
other error detection schemes currently in use for GS1 structured data. When
used alongside the GS1 General Specifications these libraries are intended to
simplify adoption of GS1 Global Model Number and to minimise the likelihood of
a flawed implementation of the error detection scheme making it into open use.

The error detection scheme for a GMN is non-trivial: It is the sum of the
products of data character values with decreasing prime weights, modulo a large
prime, with the resulting value being represented by appending two check
characters from an alphanumeric subset of the original data character set
selected by partitioning the value bitwise in two.

This project not only demonstrates clearly how to implement the details of this
algorithm in different well-known programming languages, but each library can
be relied upon as an accurate implementation of the check character pair
generation and validation processes.


Designed for Study
------------------

The libraries are provided in source form which is clearly structured and
descriptively commented enabling developers to research precisely what is
required to create an implementation of the specification with whatever
development platform they are using.

Furthermore, the libraries each include comprehensive unit tests that can be
re-purposed and applied to a specialised implementation to ensure results that
are consistent with a correct implementation of the standard.


Designed for Integration
------------------------

In addition to source form, the libraries are provided in standard packaged
formats, e.g. JAR and NuGet. Either the source can be vendored in to your
application code or the packages can be imported into your development
environment and shipped with your software application, according to preference.

Standard API documentation in HTML format is provided for the public methods
provided by each library.


Batteries Included
------------------

Each library is provided with example source code for an interactive console
application that demonstrates how to correctly call the library functions. These
applications will also accept command line arguments in which case the behave as
a utility that is appropriate for use by sysadmins with only basic scripting
experience.

The examples illustrate how to create and validate the check character pair for
a GMN, whether data is statically coded, supplied interactively or processed by
consuming each line of a file.


Available Libraries
-------------------

The helper libraries are provided in these directories:

| Directory | Purpose                   |
| --------- | ------------------------- |
| java/     | Java helper library       |
| cs/       | C# helper library         |
| js/       | JavaScript helper library |


License
-------

Copyright (c) 2019-2021 GS1 AISBL

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this library except in compliance with the License.

You may obtain a copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.


Pedigree
--------

The initial libraries and tests were written (under the commission of GS1 AISBL)
by one of the experts in the technical group that selected the algorithm based
on its performance during the analysis of several alternative schemes under
consideration.

Installation
------------

Using Maven
```xml
<dependencies>
 <dependency>
    <groupId>org.gs1</groupId>
    <artifactId>GMN</artifactId>
    <version>1.0</version>
  </dependency>
</dependencies>
```

Using Gradle
```kotlin
dependencies {
    implementation("org.gs1:GMN:1.0")
}
```