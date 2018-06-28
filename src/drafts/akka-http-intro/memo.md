Akka HTTP characteristics
 - Java API
   https://httpd.apache.org/docs/trunk/mod/event.html
   avoid blocking calls
 - stream first
   - back pressure (don't touch too much upon reactive streams as it confuses readers)
 - integration, that's why client
   - stream based integration
   - integration with rest of the world is HTTP
   - new backend/legacy backend example in the 1st akka http video
 - distribution, concurrency
 - high level dsl
 - low level possible
 - API server
   - but play is also becoming good
   - 2x2 matrix
 - fast
   - max throughput
   - compared to spray
 - history
   - spray
     - case class based HTTP model
     - efficient HTTP parsing and rendering
     - spray DSL
   - chunked data in spray was tricky -> stream~~
   - large message entity difficult
   - routing DSL can sometimes be difficult, error prone
   - the akka http video
 - compared to functional HTTP stack
 - other libraries??
   - I dunno, probably better not to touch upon them
 - rich ecosystem
   - akka-http-cors
   - akka-http-json
   - kamon
 - The Lightbend stack
   - Typelevel stack??
   - battle tested

//Maybe in a different article?
Akka Stream video: STREAMS in AKKA HTTP
 - Requests on one HTTP connection
 - Requests on one HTTP connection
 - Chunks of a chuncked message
 - Bytes of a message entity