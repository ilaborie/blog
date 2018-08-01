Continued from the "Akka HTTP and Akka Stream integration? Working differently from what I originally thought" article.

Akka HTTP's operation flow is like this.
The sync operation part is traditional Scal methond invocation chain.
That includes DB stuff, etc necessary to return to the client.
If this can be only persisting to the queue like Kafka, it can be faster?
However, usually some enrichment is needed for responsding to a POST request.
Typical things - ID creation ... what if we pool (cache) IDs??

Akka HTTP
  -- route DSL
     ---- sync operation + ---|
  -- complete()               |
                              |
                              |
                              |
                              |/ async operation
                                   + ---> streamed updates to clients