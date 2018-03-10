In SBT, seems like [some tools](https://github.com/hootsuite/sbt-swagger) could generate Swagger spec from an SBT command, but it requires you to put some Swagger info into your `build.sbt`... Then you have Swagger info is split into in Akka HTTP server code as well as `build.sbt`, which makes it harder to manage.

## Automation opportunities


I've been 
Swagger benefit
widely understood format
 - references and samples you can learn from 
 - more concrete discussions
ecosystem of tools
 - Documentation (Swagger UI) is the primary benefit
 - code generation client and server
 - client development

## Scala macros??

https://github.com/OAI/OpenAPI-Specification/issues/370


https://github.com/swagger-api/swagger-play
https://github.com/ebowman/api-first-hand
https://github.com/iheartradio/play-swagger





Without Swagger ...
300 pages of doc someone wrote in the past
not compatible with implementatoin at all
typical situation as a client developer ... very unclear description, ask server side developer
server side developer looks at IMPLEMENTATION
Back and forth conversation to clarify the situation, and you, on the server side, try to simulate an actual request in the test environment...


However, that is possible only when these two are done:
Top-down approach
problem - implementation varies by framework... probably you need to write your own custom code generator (Play tools available for Scala)
Bottom-up
Here's the problem... I'll tell you why

Illustrating the bottom up problem with the pet store sample

What do you not get...

model - if you do classof, automatically avaialbe in the 

oauth stuff in ApiOrientation - nested annotation impossible...


Feels like writing up whole swagger with extra annotations...
spring seems to have greater integration...? or not?
http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api


static file is not generated from sbt
there is an sbt plugin but...
surprisingly to me, even in java, the most common way is to generate it at runtime

annotation doesn't verify implementation / signature is correct
partially due to akka-http's route directives...?
and macros are needed?

https://github.com/scalacenter/macros
https://swagger.io/