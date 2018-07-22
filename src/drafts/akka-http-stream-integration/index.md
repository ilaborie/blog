I was expecting something like this:


// existing Flow implements business logic
HttpRequest  ----> High Level HTTP API -> Scala object -> existing Flow
HttpResponse <---- High Level HTTP API <- Scala object <- existing Flow

However, when you start scratching the code, you'll realize that you cannot express this stream in Akka HTTP high-level API.

## The problem:

The high level API expects you to return a Future[T], then put it inside `complete`.
However, Future[T] is obviusly not a stream. It only handles one value.
Your Flow handles multiple elements. How to fill in this gap? 

Just type is imcompatible, so you cannot put your Flow inside the high level API


## More detail in types
The signature of bindAndHandle expects Flow[HttpRequest, HttpResponse, Any].
And for Akka HTTP high-level API, there are nice implicits already defined to convert

  type Route = RequestContext ⇒ Future[RouteResult]

to 

  Flow[HttpRequest, HttpResponse, Any]
  // see Route.handlerFlow(route) in RouteResult



## A failing attempt:

BackendService extends Actor {
  val businessLogicStream = Source.actorRef........to(sink)
  val refStream = businessLogicStream.run()

  def handleUserCreationRequest(user: User) : Future[UserEnriched] =
      refStream ? user
}

path("users") {
  post {
    entity[User] {
      complete(backendService.handleUserCreationRequest(user))
    }
  }
}

okay this seems nice so far. not fully integrated single stream,
but separating two streams and connecting them with Source.actorRef or Source.queue
is a common technique.

However, this just doesn't work.

It returns a result for a WRONG USER <- test it.

Even if it doesn't return a wrong avalue, as in the animation below, Akka HTTP creates a new stream instance for each TCP connection. By default, Akka HTTP allows 1024 simultaneous TCP connections, so it could allow 1024 streams (or even more, if you change the config) sending elements in random order. 
Concerns from handling 1024 date sources by a single actor start arising, like buffering,failure handling, etc. We only want to think about concerns within a single TCP connection, or single HTTP request-response.

Also we introduced two hidden async boundaries, route -> backendservice, and backendservice -> Source.actorRef, which we didn't need.

## Another attempt

Svezfaz said this is the only way ... true? Seems true tho

Run (Materialize) a new stream upon each HTTP request.
https://stackoverflow.com/questions/42484553/connect-akka-http-to-akka-stream

## Coming back to basics - did we really need that in the first place

So, seemingly simple idea, integrating Akka stream into Akka HTTP high level API, turned out a mind-numbing exercise.

It seemed to me a fundamental need at first, but almost no one seems to have complained about this, and no such feature implemented for the last X years. So my problem settings must have been wrong, or there must be other easie ways to resolve this problem.

So coming back to the fundamental point - do we really need this? Probably no.
One reason is that HTTP pipelining is generally a discouraged practice. So you don't get a new HTTP request until your HTTP response is consumed by the client. You don't need to introduce back-pressure-aware operators in the middle of this flow. Just let the HTTP Request go out once all the necessary server-side processing has been done, like generating ID, persisting to DB, logging, etc.

Another reason is that, although I find Akka Stream's DSL makes it easy to understand the whole chain of actions, it is even easier in plain Scala code invoking chains of metods.

compare :
  source
    .via(logic1)
    .via(logic2)
    .mapAsync(logic3)
    .via(logic4)
    .via(logic5)
    .via(logic5)
  ----------------------
  val a = logic1
  val b = logic3
  for {

  }
  

Yes it is easier to understand the entire workflow by Akka Stream DSL, but it is only
in comparison to constructing the whole business logic chain in Akka Actor. When using plain Scala code, method invoking chains is easier.

However, what if async calls starts returning Either[A, B]? We know for expression starts cluttered....