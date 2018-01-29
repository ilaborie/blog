---
title: Remote minimal receiver example
date: "2018-01-23T01:31:00.000+0900"
published: false
---

## Overview

You can find the code and instruction to run the example at [GitHub](https://github.com/richardimaoka/resources/tree/master/serialize-minimal).

### Akka Serialization

<iframe width="480" height="270"" src="https://www.youtube.com/embed/paclLCSv6NA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Akka doc's [serialization section](https://doc.akka.io/docs/akka/2.5/serialization.html) says:

> However, messages that have to escape the JVM to reach an actor running on a different host have to undergo some form of serialization (i.e. the objects have to be converted to and from byte arrays).

This example shows a simplified version, but still the core of what Akka serialization does - 
(i.e.) how `Serialization` Akka extention class, `Serializer`,
and the message you want to serialize/deserialize work together.

### Serializer configuration

First, you need to define your serializer class, extending `Serializer`.

```scala
private[remote] trait TcpHandlers extends CommonHandlers {
  ...

  override def onMessage(ctx: ChannelHandlerContext, e: MessageEvent): Unit = {
    val bytes: Array[Byte] = e.getMessage.asInstanceOf[ChannelBuffer].array()
    if (bytes.length > 0) notifyListener(e.getChannel, InboundPayload(ByteString(bytes)))
  }
```

In this notifyListener method, an Actor is already registered as a listener.
In the example, it was `AkkaProtocolManager`, but not sure if it is always that class which is registered as a listener above.

```
  final case class ActorHandleEventListener(actor: ActorRef) extends HandleEventListener {
    override def notify(ev: HandleEvent): Unit = actor ! ev
  }
```

I couldn't figure out what's in between `AkkaProtocolManager` and `EndpointReader` but
the message will be sent to `EndpointReader` at some point.

```scala
//private[remote] class EndpointReader(
  override def receive: Receive = {
    case InboundPayload(p) if p.size <= transport.maximumPayloadBytes ⇒
      ...
      //msg.serializedMessage.message: ByteString 
      msgDispatch.dispatch(msg.recipient, msg.recipientAddress, msg.serializedMessage, msg.senderOption)
```

The call to the `dispatch` method above sends the message 

```
//DefaultMessageDispatcher
    lazy val payload: AnyRef = MessageSerializer.deserialize(system, serializedMessage)
```

EchoActor: received message = Hello!!
[ERROR] [01/25/2018 07:02:56.959] [receiverSystem-akka.remote.default-remote-dispatcher-14] [akka.tcp://receiverSystem@127.0.0.1:2551/system/endpointManager/reliableEndpointWriter-akka.tcp%3A%2F%2FsenderSystem%40127.0.0.1%3A2552-2/endpointWriter] AssociationError [akka.tcp://receiverSystem@127.0.0.1:2551] <- [akka.tcp://senderSystem@127.0.0.1:2552]: Error [Shut down address: akka.tcp://senderSystem@127.0.0.1:2552] [
akka.remote.ShutDownAssociation: Shut down address: akka.tcp://senderSystem@127.0.0.1:2552
Caused by: akka.remote.transport.Transport$InvalidAssociationException: The remote system terminated the association because it is shutting down.
]

https://groups.google.com/forum/#!topic/akka-user/eerWNwRQ7o0

## Instruction to run the example
```
> git clone https://github.com/richardimaoka/resources.git
> cd resources
> cd serialize-minimal
> sbt
> runMain example.Main
```

## Output 

Some `println` calls are inserted in the [complete example at GitHub](https://github.com/richardimaoka/resources/tree/master/serialize-minimal) to illustrate the behavior

```
[info] Running example.Main
Serializer for class example.MyMessage = example.MySerializer@254b2a65
MySerializer: toBinary(MyMessage(aaa,bbb)) is called
MySerializer: fromBinary(979797124989898) is called
original = MyMessage(aaa,bbb), class = class example.MyMessage
restored = MyMessage(aaa,bbb), class = class example.MyMessage
[success] Total time: 1 s, completed Jan 23, 2018 9:48:55 PM
```

## References 

- Official documentation of Akka serialization at https://doc.akka.io/docs/akka/2.5/serialization.html
