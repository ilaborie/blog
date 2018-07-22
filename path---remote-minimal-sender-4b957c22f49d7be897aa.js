webpackJsonp([0xdb5a049f8185],{426:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/remote-minimal-sender/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/remote-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/TJJUcaJqUeY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is continued from <a href="../remote-minimal-setup">the previous article</a>, and now we are going deep into the implementation and behavior of akka remoting on the sender side.</p>\n<h3>Workflow</h3>\n<p>As in the <code class="language-text">Main</code> of this example, the sender side sends a message <code class="language-text">&quot;Hello&quot;</code> to the receiver side, but in this example, as it uses remoting, the receiver side is referenced by <code class="language-text">ActorSelection</code> instead of local <code class="language-text">ActorRef</code> unlike the <a href="../local-minimal-sender">local sender example</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">val</span> selection<span class="token operator">:</span> ActorSelection <span class="token operator">=</span>\n  context<span class="token punctuation">.</span>actorSelection<span class="token punctuation">(</span>path<span class="token punctuation">)</span>\n\nselection <span class="token operator">!</span> <span class="token string">"Hello!!"</span></code></pre>\n      </div>\n<p><code class="language-text">ActorSelection</code> has <code class="language-text">path</code> inside, which is a URL of the target actor. The components of the <code class="language-text">path</code> URL is shown as follows: </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text"> val path = &quot;akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver&quot;</code></pre>\n      </div>\n<p><img src="/blog/path-95b81a72016011952a4d619f7c43c935.jpg" alt="path"></p>\n<p>You can find more detail about akka’s path <a href="https://doc.akka.io/docs/akka/current/general/addressing.html?language=scala#actor-references-paths-and-addresses">in the official documentation</a>, and <a href="https://doc.akka.io/docs/akka/current/remoting.html#looking-up-remote-actors">components of the path</a>.</p>\n<p>Now let’s look into the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorSelection.scala#L265"><code class="language-text">!</code> method</a> of <code class="language-text">ActorSelection</code>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">trait ScalaActorSelection {\n  this: ActorSelection ⇒\n\n  def !(msg: Any)\n       (implicit sender: ActorRef = Actor.noSender) = \n    tell(msg, sender)\n}</code></pre>\n      </div>\n<p>and the below <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorSelection.scala#L44L47"><code class="language-text">tell</code> method</a> called from the above. You can see that the original message <code class="language-text">&quot;Hello&quot;</code> is wrapped into <code class="language-text">ActorSelectionMessage</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">def tell(\n  msg: Any,\n  sender: ActorRef\n): Unit =\n  ActorSelection.deliverSelection(\n    ...,\n    ActorSelectionMessage(msg, ...)\n  )</code></pre>\n      </div>\n<p><img src="/blog/actorselectionmessage-8056069cb9493407ef88daac5b0c582c.jpg" alt="actorselectionmessage"></p>\n<p>Through the <code class="language-text">deliverSelection</code> method, <code class="language-text">ActorSelection</code> calls <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/RemoteActorRefProvider.scala#L94">the following method of <code class="language-text">RemoteActorRef</code></a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">override</span> <span class="token keyword">def</span> <span class="token operator">!</span><span class="token punctuation">(</span>message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token comment">//remote: RemoteTransport</span>\n  remote<span class="token punctuation">.</span>send<span class="token punctuation">(</span>message<span class="token punctuation">,</span> Option<span class="token punctuation">(</span>sender<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">)</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p><code class="language-text">remote</code> is an instance of <code class="language-text">RemoteTransport</code> which has the following <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Remoting.scala#L222L225"><code class="language-text">send</code> method</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">override</span> <span class="token keyword">def</span> send<span class="token punctuation">(</span>message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">case</span> Some<span class="token punctuation">(</span>manager<span class="token punctuation">)</span> \n    ⇒ manager<span class="token punctuation">.</span>tell<span class="token punctuation">(</span>Send<span class="token punctuation">(</span>message<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>  \n<span class="token punctuation">}</span>  </code></pre>\n      </div>\n<p><code class="language-text">manager</code> is ActorRef pointing to an <code class="language-text">EndPointManager</code>. (More precisely, there is actually one more actor in-between, but the message is anyway delivered to <code class="language-text">EndPointManager</code>).</p>\n<p><img src="/blog/endpointmanager-2560d7337fa371cd16000085e636fded.jpg" alt="endpointmanager"></p>\n<p><code class="language-text">EndpointManager</code> manager <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Endpoint.scala#L567">has a buffer inside</a>, </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">val buffer = new java.util.LinkedList[AnyRef]</code></pre>\n      </div>\n<p>and upon flushing the buffer, <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Endpoint.scala#L673L735">the <code class="language-text">sendBufferedMessages</code> method</a> is called to efficiently send buffered messages via network. </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">def sendBufferedMessages(): Unit = {\n  ...\n  val ok = writePrioLoop() &amp;&amp; writeLoop(SendBufferBatchSize)\n  ...\n}</code></pre>\n      </div>\n<p>The reason for this buffering behavior is, if my understanding is correct, because there is throughput gap between local message-passing (up to <code class="language-text">EndPointWriter</code>) and the remote message-passing (after <code class="language-text">EndPointWriter</code>), so this buffering behavior will fill in the gap and keep the overall throughput of whole message-passing high.</p>\n<p>There is a following method in <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Endpoint.scala#L777L823"><code class="language-text">EndpointWriter</code></a>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">//class EndpointWriter in akka.remote.Endpoint.scala\n  def writeSend(s: Send): Boolean = try {\n    ...\n      \n      val pdu: ByteString = codec.constructMessage(\n        ..., \n        serializeMessage(s.message), \n        ...)\n\n      ...\n      val ok = h.write(pdu)\n    ...\n  }</code></pre>\n      </div>\n<p>which performs message serialization, so that the message is converted to a payload which can be passed via network. As akka doc’s <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">serialization section</a> says:</p>\n<blockquote>\n<p>However, messages that have to escape the JVM to reach an actor running on a different host have to undergo some form of serialization (i.e. the objects have to be converted to and from byte arrays).</p>\n</blockquote>\n<p><img src="/blog/serialize-c15d3e21df298bae63af63ee49bfbe24.jpg" alt="serialize"></p>\n<p>serialization converts a JVM object into <code class="language-text">Array[Byte]</code>. The above <code class="language-text">writeSend</code> converts <code class="language-text">Array[Byte]</code> further into <code class="language-text">ByteString</code> by <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/util/ByteString.scala#L25">its <code class="language-text">apply</code> method</a>. <code class="language-text">ByteString</code> is extensively used in Akka when payload needs to be send via network.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">object ByteString {\n\n  /**\n   * Creates a new ByteString by copying a byte array.\n   */\n  def apply(bytes: Array[Byte]): ByteString = CompactByteString(bytes)</code></pre>\n      </div>\n<p>Now it comes down to the point between the application (akka) layer and the network layer. The <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/transport/netty/TcpSupport.scala#L86L103"><code class="language-text">write</code> method</a> of <code class="language-text">TcpAssociationHandle</code> has <code class="language-text">Channel</code> class instance where the <code class="language-text">Channel</code> class is defined in the <code class="language-text">Netty</code> library.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">//Channel is a class in netty, so from here the work is passed to netty\nprivate[remote] class TcpAssociationHandle(\n  val localAddress:    Address,\n  val remoteAddress:   Address,\n  val transport:       NettyTransport,\n  private val channel: Channel)\n  extends AssociationHandle {\n  import transport.executionContext\n\n  override val readHandlerPromise: Promise[HandleEventListener] = Promise()\n\n  override def write(payload: ByteString): Boolean =\n    if (channel.isWritable &amp;&amp; channel.isOpen) {\n      channel.write(ChannelBuffers.wrappedBuffer(payload.asByteBuffer))\n      true\n    } else false</code></pre>\n      </div>\n<p><img src="/blog/netty-96343e72e3f9855be8e66c37ed135e02.jpg" alt="netty"></p>\n<p>So this lets netty take care of payload transfer to a remote JVM.</p>\n<h2>Instruction to run the example, and output</h2>\n<p>As this example uses <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">Akka remoting</a> to send a message,\nyou need to run two JVMs for the receiver and sender of the application respectively.</p>\n<p>Firstly, run the receiver side with the <code class="language-text">receiver</code> argument supplied to <code class="language-text">Main</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; git clone https://github.com/richardimaoka/resources.git\n&gt; cd resources\n&gt; cd remote-minimal\n&gt; sbt\n&gt; runMain example.Main receiver</code></pre>\n      </div>\n<p>You’ll get output like below, then it waits until the message is sent from the sender.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; runMain example.Main receiver\n[info] Running example.Main receiver\nProgram args:\nreceiver\nrunning startMessageReceiver()\n[INFO] [02/03/2018 13:36:58.281] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:36:58.462] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://receiverSystem@127.0.0.1:2551]\n[INFO] [02/03/2018 13:36:58.464] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://receiverSystem@127.0.0.1:2551]\nprovider = remote\nlistening at port = 2551\nstarted a receiver actor = Actor[akka://receiverSystem/user/receiver#-603875191]</code></pre>\n      </div>\n<p>Then in the same directory, run the same <code class="language-text">Main</code> with <code class="language-text">sender</code> as the argument</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; sbt\n&gt; runMain example.Main sender</code></pre>\n      </div>\n<p>this is the sender side output:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] Running example.Main sender\nProgram args:\nsender\nrunning startMessageSender()\n[INFO] [02/03/2018 13:37:16.215] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:37:16.427] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://senderSystem@127.0.0.1:2552]\n[INFO] [02/03/2018 13:37:16.432] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://senderSystem@127.0.0.1:2552]\nprovider = remote\nlistening at port = 2552\nsending a message to akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver\n[INFO] [02/03/2018 13:37:19.533] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:37:19.537] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.actor.default-dispatcher-4] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remoting shut down.\n[success] Total time: 5 s, completed Feb 3, 2018 1:37:19 PM</code></pre>\n      </div>\n<p>then you see the receiver output as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">EchoActor: received message = Hello!!</code></pre>\n      </div>\n<p>and immediately after that, the receiver side shows this error, which can be ignored.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[ERROR] [02/03/2018 13:37:19.572] [receiverSystem-akka.remote.default-remote-dispatcher-15] [akka.tcp://receiverSystem@127.0.0.1:2551/system/endpointManager/reliableEndpointWriter-akka.tcp%3A%2F%2FsenderSystem%40127.0.0.1%3A2552-0/endpointWriter] AssociationError [akka.tcp://receiverSystem@127.0.0.1:2551] &lt;- [akka.tcp://senderSystem@127.0.0.1:2552]: Error [Shut down address: akka.tcp://senderSystem@127.0.0.1:2552] [\nakka.remote.ShutDownAssociation: Shut down address: akka.tcp://senderSystem@127.0.0.1:2552\nCaused by: akka.remote.transport.Transport$InvalidAssociationException: The remote system terminated the association because it is shutting down.\n]</code></pre>\n      </div>\n<p>As explained in <a href="https://groups.google.com/forum/#!topic/akka-user/eerWNwRQ7o0">this thrad in akka-user</a> mailing list, the error happens specifically when you launch a process like this example from sbt, but when you compile your application and run it witout sbt, then the error disappears.</p>\n<p>Once everything is done, press the enter key on the receiver side’s console and you get this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[INFO] [02/03/2018 13:38:05.942] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:38:05.944] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.actor.default-dispatcher-3] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.remote.default-remote-dispatcher-6] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remoting shut down.</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka remoting at <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">https://doc.akka.io/docs/akka/2.5/remoting.html</a></li>\n<li>Official documentation of Akka serialization at <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">https://doc.akka.io/docs/akka/2.5/serialization.html</a></li>\n<li>Netty documentation at <a href="https://netty.io/">https://netty.io/</a></li>\n</ul>',frontmatter:{title:"Akka remoting minimal example part 2 - sender side",date:"February 03, 2018"}}},pathContext:{slug:"/remote-minimal-sender/"}}}});
//# sourceMappingURL=path---remote-minimal-sender-4b957c22f49d7be897aa.js.map