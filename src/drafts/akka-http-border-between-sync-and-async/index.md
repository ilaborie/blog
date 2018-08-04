---
title: Akka HTTP Quickstart
date: "2018-08-04T12:31:08.000+0900"
---


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


# Article: Streaming Nature of Akka HTTP
Illustration of what happens - demo? e.g. See if 2,000 clients connect?
No gap of knowledge in the steps, low expectation for background knowledge
This article (articles?) MUST NOT be a tutorial - then what? Deep-dive, or showing nice features with code? Showing nice features without code …?
You need to be clear about what the intention of the technology/technique used there

topics (or articles):
File handing and multipart requests with Akka HTTP

[high-level-api-step1.gif](#)

![](/static/img/pixel.gif)

![](https://d2mxuefqeaa7sj.cloudfront.net/s_36764BA305985A1420F4269C48888E1A9F3D093B054782F69030396166643E79_1533310544834_IMG_0144.JPG)


[high-level-api.gif](#)
TCP is a stateful connection

![](https://d2mxuefqeaa7sj.cloudfront.net/s_36764BA305985A1420F4269C48888E1A9F3D093B054782F69030396166643E79_1533310600158_Akka-HTTP-response-streaming.gif)


https://en.wikipedia.org/wiki/Stateless_protocol

https://www.youtube.com/watch?v=LyDqA-dAPW4&


[https://youtu.be/LyDqA-dAPW4](https://youtu.be/LyDqA-dAPW4)

