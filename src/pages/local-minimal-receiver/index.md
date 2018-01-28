---
title: Local Actor workflow part 2 - Receiver side
date: "2018-01-30T01:31:00.000+0900"
---

## Overview

You can find the code and instruction to run the example at [GitHub](https://github.com/richardimaoka/resources/tree/master/local-minimal).

<iframe width="640" height="360" src="https://www.youtube.com/embed/LbuLAtN20HA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>


## Workflow 

```scala
class MessageSender(messageReceiver: ActorRef) extends Actor {
  override def preStart(): Unit = {
    val messages = List(
      "Hello World",
      "Hello Universe",
      "Hello Galaxy"
    )

    for(msg <- messages)
      messageReceiver ! msg
  }

  ...
}
```

```scala
class MessageReceiver extends Actor {
  def receive = {
    case s: String =>
      EchoActor: received message = $s")
  }
}
```

![message](./message.jpg)

```scala
val receiver = 
  system.actorOf(Props[MessageReceiver], "receiver")

system.actorOf(MessageSender.props(receiver), "sender")
```


```scala
//trait Cell in akka/actor/dungeon/ActorCell.scala
final def sendMessage(message: Any, sender: ActorRef): Unit
  = sendMessage(Envelope(message, sender, system))

```

![envelope](./envelope.jpg)


```scala
//trait Dispatch in akka/actor/Dispatch.scala
def sendMessage(msg: Envelope): Unit =
  try {
    ...
    dispatcher.dispatch(this, msg)
  } 
```

```scala
//class Dispatcher in akka/dispatch/Dispatcher.scala
protected[akka] def dispatch(receiver: ActorCell, invocation: Envelope): Unit = {
  val mbox = receiver.mailbox
  mbox.enqueue(receiver.self, invocation)
  registerForExecution(mbox, true, false)
}
```

![dispatcher](./dispatcher.jpg)

```scala
//object UnboundedMailbox in in akka/dispatch/Mailbox.scala
class MessageQueue 
  extends ConcurrentLinkedQueue[Envelope] 
  with UnboundedQueueBasedMessageQueue { ... }
```

```scala
//class Dispatcher in akka/dispatch/Dispatcher.scala
protected final def executorService: ExecutorServiceDelegate 
  = executorServiceDelegate

...

protected[akka] override def registerForExecution(
  mbox: Mailbox, 
  hasMessageHint: Boolean, 
  hasSystemMessageHint: Boolean): Boolean = {
  ...
  try {
    executorService execute mbox
    ...
  } catch {
    ...
  } 
  ...
}
```

```scala
//Mailbox in akka/dispatch/Mailbox.scala
private[akka] abstract class Mailbox(
  val messageQueue: MessageQueue
) extends ForkJoinTask[Unit] 
  with SystemMessageQueue 
  with Runnable {
    ...
}

```

![messagequeue](./messagequeue.jpg)

## Instruction to run the example
```
> git clone https://github.com/richardimaoka/resources.git
> cd resources
> cd serialize-minimal
> sbt
> runMain example.Main
```

## Output 

Some `println` calls are inserted in the [complete example at GitHub](https://github.com/richardimaoka/resources/tree/master/local-minimal) to illustrate the behavior.

Thread names are shown as [exampleSystem-akka.actor.default-dispatcher-3] and [...-4].


```
[info] Running example.Main
provider = local
[exampleSystem-akka.actor.default-dispatcher-3] sending message Hello World to Actor[akka://exampleSystem/user/receiver#607760908]
[exampleSystem-akka.actor.default-dispatcher-3] sending message Hello Universe to Actor[akka://exampleSystem/user/receiver#607760908]
[exampleSystem-akka.actor.default-dispatcher-4] EchoActor: received message = Hello World
[exampleSystem-akka.actor.default-dispatcher-3] sending message Hello Galaxy to Actor[akka://exampleSystem/user/receiver#607760908]
[exampleSystem-akka.actor.default-dispatcher-4] EchoActor: received message = Hello Universe
[exampleSystem-akka.actor.default-dispatcher-4] EchoActor: received message = Hello Galaxy
[success] Total time: 9 s, completed Jan 29, 2018 6:44:14 AM
```

## References 

- Official documentation of Akka serialization at https://doc.akka.io/docs/akka/2.5/serialization.html
