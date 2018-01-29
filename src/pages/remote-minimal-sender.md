---
title: Remote minimal sender example
date: "2018-01-23T01:31:00.000+0900"
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
 selection ! "Hello!!"
```

```
trait ScalaActorSelection {
  this: ActorSelection ⇒

  def !(msg: Any)(implicit sender: ActorRef = Actor.noSender) = tell(msg, sender)
}
```

```scala
//abstract class ActorSelection extends Serializable {
ActorSelectionMessage(msg, path, wildcardFanOut = false)
```      

```scala
//class RemoteActorRef in akka/remote/RemoteActorRefProvider.scala
  override def !(message: Any)(...): Unit = {
    ...
    remote.send(message, Option(sender), this) 
    ...
  }
```

```scala
//akka.remote.Remoting.scala class Remoting(
  override def send(message: Any, ... ): Unit = 
    ...
    manager.tell(Send(message, ... ), ... )
    ...  
  }  
```

```scala
//Remoting.scala
final case class Send(
  message:      Any, 
  senderOption: OptionVal[ActorRef], 
  recipient:    RemoteActorRef, 
  seqOpt:       Option[SeqNo] = None
)
```

```
//private[remote] class EndpointManager
  val accepting: Receive = {
    ...not showing code but link to the github as the code is too complicated?

```

```
//class EndpointReader in akka.remote.Endpoint.scala
  val buffer = new java.util.LinkedList[AnyRef]
```  

```
//class EndpointReader in akka.remote.Endpoint.scala
  def sendBufferedMessages(): Unit = {
    ...
    val ok = writePrioLoop() && writeLoop(SendBufferBatchSize)
    ...
  }
```

```
//class EndpointReader in akka.remote.Endpoint.scala
  def writeSend(s: Send): Boolean = try {
    ...
      
      val pdu: ByteString = codec.constructMessage(
        ..., 
        serializeMessage(s.message), 
        ...)

      ...
      val ok = h.write(pdu)
    ...
  }
```

```
object ByteString {

  /**
   * Creates a new ByteString by copying a byte array.
   */
  def apply(bytes: Array[Byte]): ByteString = CompactByteString(bytes)
```

```
//Channel is a class in netty, so from here the work is passed to netty
private[remote] class TcpAssociationHandle(
  val localAddress:    Address,
  val remoteAddress:   Address,
  val transport:       NettyTransport,
  private val channel: Channel)
  extends AssociationHandle {
  import transport.executionContext

  override val readHandlerPromise: Promise[HandleEventListener] = Promise()

  override def write(payload: ByteString): Boolean =
    if (channel.isWritable && channel.isOpen) {
      channel.write(ChannelBuffers.wrappedBuffer(payload.asByteBuffer))
      true
    } else false

```

```
//ByteString
    override def asByteBuffer: ByteBuffer = toByteString1.asByteBuffer
```


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
