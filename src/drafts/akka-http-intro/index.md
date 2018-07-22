When I learned about Akka HTTP, I have actually failed to understand how that works a few times in the past.

There have been great blog posts about Akka HTTP, but probably because og its conceptual difference from other
HTTP server/client software, and coding convention reflecting the Akka HTTP concepts, it has been difficult for
me to understand it until I really deep dived into the code.

Hopefully, this (series of) article(s) help you people who are:
 - not familiar with Akka HTTP yet
 - but still need to, or want to use it without having much time to dive into it


## Akka HTTP concepts

First thing first, I strongly recommend this video to understand why Akka HTTP was born,
and what kind of problems it is supposed to solve. Some information in the video is bit
outdated

https://www.youtube.com/watch?v=y_slPbktLr0


API server/integration engine
a generation of event-driven server, not spawning a new process/non blocking
back pressure
integration
history, spray, what they tried to overcome?
Lightbend
Comparison with Play, then next article?

https://doc.akka.io/docs/akka-http/current/introduction.html
> One of the strengths of Akka HTTP is that streaming data is at its heart meaning that both request and response bodies can be streamed through the server achieving constant memory usage even for very large requests or responses. **Streaming responses will be backpressured by the remote client so that the server will not push data faster than the client can handle**, streaming requests means that the server decides how fast the remote client can push the data of the request body.