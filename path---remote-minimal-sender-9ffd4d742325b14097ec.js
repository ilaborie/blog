webpackJsonp([0xdb5a049f8185],{532:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/remote-minimal-sender/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/remote-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/TJJUcaJqUeY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is continued from <a href="../remote-minimal-setup">the previous article</a>, and now we are going deep into the implementation and behavior of akka remoting on the sender side.</p>\n<h3>Workflow</h3>\n<p>As in the <code>Main</code> of this example, the sender side sends a message <code>"Hello"</code> to the receiver side, but in this example, as it uses remoting, the receiver side is referenced by <code>ActorSelection</code> instead of local <code>ActorRef</code> unlike the <a href="../local-minimal-sender">local sender example</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">val</span> selection<span class="token operator">:</span> ActorSelection <span class="token operator">=</span>\n  context<span class="token punctuation">.</span>actorSelection<span class="token punctuation">(</span>path<span class="token punctuation">)</span>\n\nselection <span class="token operator">!</span> <span class="token string">"Hello!!"</span>\n</code></pre>\n      </div>\n<p><code>ActorSelection</code> has <code>path</code> inside, which is a URL of the target actor. The components of the <code>path</code> URL is shown as follows: </p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code> val path = "akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver"</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/path-95b81a72016011952a4d619f7c43c935-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMEBf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHtqCDQs//EABoQAAICAwAAAAAAAAAAAAAAAAECAxIQESL/2gAIAQEAAQUC62S1Y7Fc/wD/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAgBAwEBPwFH/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQIBAT8BV//EABgQAAIDAAAAAAAAAAAAAAAAAAAxICEi/9oACAEBAAY/AhWacP/EABcQAQEBAQAAAAAAAAAAAAAAABEBABD/2gAIAQEAAT8htSSZkWW2RcOf/9oADAMBAAIAAwAAABA7D//EABcRAQEBAQAAAAAAAAAAAAAAABEAASH/2gAIAQMBAT8QOFgwb//EABcRAQEBAQAAAAAAAAAAAAAAABEAASH/2gAIAQIBAT8Qetp1L//EABwQAQEAAgIDAAAAAAAAAAAAAAERACEQMUFxkf/aAAgBAQABPxDSCeHAdMsmi5YOgKop6xLkDd/eP//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="path"\n        title=""\n        src="/blog/static/path-95b81a72016011952a4d619f7c43c935-f8fb9.jpg"\n        srcset="/blog/static/path-95b81a72016011952a4d619f7c43c935-e8976.jpg 148w,\n/blog/static/path-95b81a72016011952a4d619f7c43c935-63df2.jpg 295w,\n/blog/static/path-95b81a72016011952a4d619f7c43c935-f8fb9.jpg 590w,\n/blog/static/path-95b81a72016011952a4d619f7c43c935-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>You can find more detail about akka’s path <a href="https://doc.akka.io/docs/akka/current/general/addressing.html?language=scala#actor-references-paths-and-addresses">in the official documentation</a>, and <a href="https://doc.akka.io/docs/akka/current/remoting.html#looking-up-remote-actors">components of the path</a>.</p>\n<p>Now let’s look into the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorSelection.scala#L265"><code>!</code> method</a> of <code>ActorSelection</code>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>trait ScalaActorSelection {\n  this: ActorSelection ⇒\n\n  def !(msg: Any)\n       (implicit sender: ActorRef = Actor.noSender) = \n    tell(msg, sender)\n}</code></pre>\n      </div>\n<p>and the below <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorSelection.scala#L44L47"><code>tell</code> method</a> called from the above. You can see that the original message <code>"Hello"</code> is wrapped into <code>ActorSelectionMessage</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>def tell(\n  msg: Any,\n  sender: ActorRef\n): Unit =\n  ActorSelection.deliverSelection(\n    ...,\n    ActorSelectionMessage(msg, ...)\n  )</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/actorselectionmessage-8056069cb9493407ef88daac5b0c582c-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMBBAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB3IYIgsFf/8QAGhAAAgIDAAAAAAAAAAAAAAAAARIAAgMQIf/aAAgBAQABBQLsLLjY13//xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAgBAwEBPwFH/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQIBAT8BV//EABgQAAIDAAAAAAAAAAAAAAAAAAAxICEi/9oACAEBAAY/AhWacP/EABkQAQEAAwEAAAAAAAAAAAAAABEBABAxQf/aAAgBAQABPyHu+ZcUIZbZFo1//9oADAMBAAIAAwAAABA/D//EABcRAQEBAQAAAAAAAAAAAAAAABEAASH/2gAIAQMBAT8QOWDBv//EABcRAQEBAQAAAAAAAAAAAAAAABEAASH/2gAIAQIBAT8Qetp1L//EABwQAQEAAgIDAAAAAAAAAAAAAAERACEQMUFxkf/aAAgBAQABPxCojTwuaxlJOrlg6AqinrEuQN394//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="actorselectionmessage"\n        title=""\n        src="/blog/static/actorselectionmessage-8056069cb9493407ef88daac5b0c582c-f8fb9.jpg"\n        srcset="/blog/static/actorselectionmessage-8056069cb9493407ef88daac5b0c582c-e8976.jpg 148w,\n/blog/static/actorselectionmessage-8056069cb9493407ef88daac5b0c582c-63df2.jpg 295w,\n/blog/static/actorselectionmessage-8056069cb9493407ef88daac5b0c582c-f8fb9.jpg 590w,\n/blog/static/actorselectionmessage-8056069cb9493407ef88daac5b0c582c-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Through the <code>deliverSelection</code> method, <code>ActorSelection</code> calls <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/RemoteActorRefProvider.scala#L94">the following method of <code>RemoteActorRef</code></a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">override</span> <span class="token keyword">def</span> <span class="token operator">!</span><span class="token punctuation">(</span>message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token comment">//remote: RemoteTransport</span>\n  remote<span class="token punctuation">.</span>send<span class="token punctuation">(</span>message<span class="token punctuation">,</span> Option<span class="token punctuation">(</span>sender<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">)</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p><code>remote</code> is an instance of <code>RemoteTransport</code> which has the following <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Remoting.scala#L222L225"><code>send</code> method</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">override</span> <span class="token keyword">def</span> send<span class="token punctuation">(</span>message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">case</span> Some<span class="token punctuation">(</span>manager<span class="token punctuation">)</span> \n    ⇒ manager<span class="token punctuation">.</span>tell<span class="token punctuation">(</span>Send<span class="token punctuation">(</span>message<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>  \n<span class="token punctuation">}</span>  \n</code></pre>\n      </div>\n<p><code>manager</code> is ActorRef pointing to an <code>EndPointManager</code>. (More precisely, there is actually one more actor in-between, but the message is anyway delivered to <code>EndPointManager</code>).</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/endpointmanager-2560d7337fa371cd16000085e636fded-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMCBf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHqmrJqj//EABoQAAMAAwEAAAAAAAAAAAAAAAECEgMQESL/2gAIAQEAAQUCfL66ZQtMitf/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAgBAwEBPwFH/8QAFxEBAAMAAAAAAAAAAAAAAAAAAAEhQf/aAAgBAgEBPwGsS//EABsQAAIBBQAAAAAAAAAAAAAAAAARARASISJh/9oACAEBAAY/ArYOmw1mv//EABoQAAMBAAMAAAAAAAAAAAAAAAABESEQMXH/2gAIAQEAAT8hRujHVNgd7L6M0i4//9oADAMBAAIAAwAAABA3H//EABYRAQEBAAAAAAAAAAAAAAAAAAERAP/aAAgBAwEBPxAsRwQl3//EABcRAQEBAQAAAAAAAAAAAAAAAAERACH/2gAIAQIBAT8QehxVs3//xAAbEAEBAAMAAwAAAAAAAAAAAAABEQAhYRCRwf/aAAgBAQABPxCggdUNY61BIDPuUUb1UayjDrOB68f/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="endpointmanager"\n        title=""\n        src="/blog/static/endpointmanager-2560d7337fa371cd16000085e636fded-f8fb9.jpg"\n        srcset="/blog/static/endpointmanager-2560d7337fa371cd16000085e636fded-e8976.jpg 148w,\n/blog/static/endpointmanager-2560d7337fa371cd16000085e636fded-63df2.jpg 295w,\n/blog/static/endpointmanager-2560d7337fa371cd16000085e636fded-f8fb9.jpg 590w,\n/blog/static/endpointmanager-2560d7337fa371cd16000085e636fded-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><code>EndpointManager</code> manager <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Endpoint.scala#L567">has a buffer inside</a>, </p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>val buffer = new java.util.LinkedList[AnyRef]</code></pre>\n      </div>\n<p>and upon flushing the buffer, <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Endpoint.scala#L673L735">the <code>sendBufferedMessages</code> method</a> is called to efficiently send buffered messages via network. </p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>def sendBufferedMessages(): Unit = {\n  ...\n  val ok = writePrioLoop() && writeLoop(SendBufferBatchSize)\n  ...\n}</code></pre>\n      </div>\n<p>The reason for this buffering behavior is, if my understanding is correct, because there is throughput gap between local message-passing (up to <code>EndPointWriter</code>) and the remote message-passing (after <code>EndPointWriter</code>), so this buffering behavior will fill in the gap and keep the overall throughput of whole message-passing high.</p>\n<p>There is a following method in <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/Endpoint.scala#L777L823"><code>EndpointWriter</code></a>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>//class EndpointWriter in akka.remote.Endpoint.scala\n  def writeSend(s: Send): Boolean = try {\n    ...\n      \n      val pdu: ByteString = codec.constructMessage(\n        ..., \n        serializeMessage(s.message), \n        ...)\n\n      ...\n      val ok = h.write(pdu)\n    ...\n  }</code></pre>\n      </div>\n<p>which performs message serialization, so that the message is converted to a payload which can be passed via network. As akka doc’s <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">serialization section</a> says:</p>\n<blockquote>\n<p>However, messages that have to escape the JVM to reach an actor running on a different host have to undergo some form of serialization (i.e. the objects have to be converted to and from byte arrays).</p>\n</blockquote>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/serialize-c15d3e21df298bae63af63ee49bfbe24-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABAABAv/EABYBAQEBAAAAAAAAAAAAAAAAAAECBP/aAAwDAQACEAMQAAABfwvZwjmSf//EABgQAAMBAQAAAAAAAAAAAAAAAAABAhEQ/9oACAEBAAEFAsY1RKrO/wD/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEv/aAAgBAwEBPwGUv//EABYRAQEBAAAAAAAAAAAAAAAAAAEAA//aAAgBAgEBPwEyJzFv/8QAFhAAAwAAAAAAAAAAAAAAAAAAECAh/9oACAEBAAY/AhU//8QAGhABAQACAwAAAAAAAAAAAAAAAREAICFRYf/aAAgBAQABPyHwcHUr0TEcDdP/2gAMAwEAAgADAAAAEKs//8QAFhEAAwAAAAAAAAAAAAAAAAAAARAR/9oACAEDAQE/EICf/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARIf/aAAgBAgEBPxADuzhOX//EABsQAQACAgMAAAAAAAAAAAAAABEAARAhQVHx/9oACAEBAAE/EPGuaKJwCIa66uFKZ//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="serialize"\n        title=""\n        src="/blog/static/serialize-c15d3e21df298bae63af63ee49bfbe24-f8fb9.jpg"\n        srcset="/blog/static/serialize-c15d3e21df298bae63af63ee49bfbe24-e8976.jpg 148w,\n/blog/static/serialize-c15d3e21df298bae63af63ee49bfbe24-63df2.jpg 295w,\n/blog/static/serialize-c15d3e21df298bae63af63ee49bfbe24-f8fb9.jpg 590w,\n/blog/static/serialize-c15d3e21df298bae63af63ee49bfbe24-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>serialization converts a JVM object into <code>Array[Byte]</code>. The above <code>writeSend</code> converts <code>Array[Byte]</code> further into <code>ByteString</code> by <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/util/ByteString.scala#L25">its <code>apply</code> method</a>. <code>ByteString</code> is extensively used in Akka when payload needs to be send via network.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>object ByteString {\n\n  /**\n   * Creates a new ByteString by copying a byte array.\n   */\n  def apply(bytes: Array[Byte]): ByteString = CompactByteString(bytes)</code></pre>\n      </div>\n<p>Now it comes down to the point between the application (akka) layer and the network layer. The <a href="https://github.com/akka/akka/blob/v2.5.9/akka-remote/src/main/scala/akka/remote/transport/netty/TcpSupport.scala#L86L103"><code>write</code> method</a> of <code>TcpAssociationHandle</code> has <code>Channel</code> class instance where the <code>Channel</code> class is defined in the <code>Netty</code> library.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>//Channel is a class in netty, so from here the work is passed to netty\nprivate[remote] class TcpAssociationHandle(\n  val localAddress:    Address,\n  val remoteAddress:   Address,\n  val transport:       NettyTransport,\n  private val channel: Channel)\n  extends AssociationHandle {\n  import transport.executionContext\n\n  override val readHandlerPromise: Promise[HandleEventListener] = Promise()\n\n  override def write(payload: ByteString): Boolean =\n    if (channel.isWritable && channel.isOpen) {\n      channel.write(ChannelBuffers.wrappedBuffer(payload.asByteBuffer))\n      true\n    } else false</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMBBP/EABUBAQEAAAAAAAAAAAAAAAAAAAIE/9oADAMBAAIQAxAAAAHuWwxxXJ//xAAYEAADAQEAAAAAAAAAAAAAAAAAAhEBMf/aAAgBAQABBQI2xbFRVGM5/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECEf/aAAgBAwEBPwGZRh//xAAYEQADAQEAAAAAAAAAAAAAAAAAARECA//aAAgBAgEBPwFc4PNZ/8QAFxAAAwEAAAAAAAAAAAAAAAAAABAhAf/aAAgBAQAGPwJUmP8A/8QAGxABAQABBQAAAAAAAAAAAAAAAREAECExgZH/2gAIAQEAAT8h6fMlQNwvabiCyvOq/9oADAMBAAIAAwAAABCLD//EABYRAQEBAAAAAAAAAAAAAAAAAAEQIf/aAAgBAwEBPxADk//EABcRAQEBAQAAAAAAAAAAAAAAAAEAETH/2gAIAQIBAT8QFbCjy//EAB4QAQADAAAHAAAAAAAAAAAAAAEAESExQVFhcZHw/9oACAEBAAE/EBVQVOigWgjCmAk1u/CWuPKXfrZgPM0Vv3P/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="netty"\n        title=""\n        src="/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-f8fb9.jpg"\n        srcset="/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-e8976.jpg 148w,\n/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-63df2.jpg 295w,\n/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-f8fb9.jpg 590w,\n/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>So this lets netty take care of payload transfer to a remote JVM.</p>\n<h2>Instruction to run the example, and output</h2>\n<p>As this example uses <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">Akka remoting</a> to send a message,\nyou need to run two JVMs for the receiver and sender of the application respectively.</p>\n<p>Firstly, run the receiver side with the <code>receiver</code> argument supplied to <code>Main</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd remote-minimal\n> sbt\n> runMain example.Main receiver</code></pre>\n      </div>\n<p>You’ll get output like below, then it waits until the message is sent from the sender.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.Main receiver\n[info] Running example.Main receiver\nProgram args:\nreceiver\nrunning startMessageReceiver()\n[INFO] [02/03/2018 13:36:58.281] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:36:58.462] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://receiverSystem@127.0.0.1:2551]\n[INFO] [02/03/2018 13:36:58.464] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://receiverSystem@127.0.0.1:2551]\nprovider = remote\nlistening at port = 2551\nstarted a receiver actor = Actor[akka://receiverSystem/user/receiver#-603875191]</code></pre>\n      </div>\n<p>Then in the same directory, run the same <code>Main</code> with <code>sender</code> as the argument</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> sbt\n> runMain example.Main sender</code></pre>\n      </div>\n<p>this is the sender side output:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.Main sender\nProgram args:\nsender\nrunning startMessageSender()\n[INFO] [02/03/2018 13:37:16.215] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:37:16.427] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://senderSystem@127.0.0.1:2552]\n[INFO] [02/03/2018 13:37:16.432] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://senderSystem@127.0.0.1:2552]\nprovider = remote\nlistening at port = 2552\nsending a message to akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver\n[INFO] [02/03/2018 13:37:19.533] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:37:19.537] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.actor.default-dispatcher-4] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remoting shut down.\n[success] Total time: 5 s, completed Feb 3, 2018 1:37:19 PM</code></pre>\n      </div>\n<p>then you see the receiver output as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>EchoActor: received message = Hello!!</code></pre>\n      </div>\n<p>and immediately after that, the receiver side shows this error, which can be ignored.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[ERROR] [02/03/2018 13:37:19.572] [receiverSystem-akka.remote.default-remote-dispatcher-15] [akka.tcp://receiverSystem@127.0.0.1:2551/system/endpointManager/reliableEndpointWriter-akka.tcp%3A%2F%2FsenderSystem%40127.0.0.1%3A2552-0/endpointWriter] AssociationError [akka.tcp://receiverSystem@127.0.0.1:2551] <- [akka.tcp://senderSystem@127.0.0.1:2552]: Error [Shut down address: akka.tcp://senderSystem@127.0.0.1:2552] [\nakka.remote.ShutDownAssociation: Shut down address: akka.tcp://senderSystem@127.0.0.1:2552\nCaused by: akka.remote.transport.Transport$InvalidAssociationException: The remote system terminated the association because it is shutting down.\n]</code></pre>\n      </div>\n<p>As explained in <a href="https://groups.google.com/forum/#!topic/akka-user/eerWNwRQ7o0">this thrad in akka-user</a> mailing list, the error happens specifically when you launch a process like this example from sbt, but when you compile your application and run it witout sbt, then the error disappears.</p>\n<p>Once everything is done, press the enter key on the receiver side’s console and you get this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[INFO] [02/03/2018 13:38:05.942] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:38:05.944] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.actor.default-dispatcher-3] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.remote.default-remote-dispatcher-6] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remoting shut down.</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka remoting at <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">https://doc.akka.io/docs/akka/2.5/remoting.html</a></li>\n<li>Official documentation of Akka serialization at <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">https://doc.akka.io/docs/akka/2.5/serialization.html</a></li>\n<li>Netty documentation at <a href="https://netty.io/">https://netty.io/</a></li>\n</ul>',frontmatter:{title:"Akka remoting minimal example part 2 - sender side",date:"February 03, 2018"}}},pathContext:{slug:"/remote-minimal-sender/"}}}});
//# sourceMappingURL=path---remote-minimal-sender-9ffd4d742325b14097ec.js.map