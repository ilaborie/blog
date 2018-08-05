webpackJsonp([0x61f1a292af65],{439:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/remote-minimal-receiver/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/remote-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/YAuamfYBb1o" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is the last of three articles about akka’s remote message passing. The previous articles are here:</p>\n<ul>\n<li><a href="../remote-minimal-setup">Akka remoting minimal example part 1 - setup</a></li>\n<li><a href="../remote-minimal-sender">Akka remoting minimal example part 2 - sender side</a></li>\n</ul>\n<h3>TcpHandlers</h3>\n<p>As in the previous article, Netty takes care of the message transport in the network layer.</p>\n<p><img src="/blog/netty-96343e72e3f9855be8e66c37ed135e02.jpg" alt="netty"></p>\n<p>Onc the receiver side, <code class="language-text">TcpHandler</code> has the <code class="language-text">onMessage</code> method, which is called when a message payload (serialized byte array) arrives on the receiver side. </p>\n<p><img src="/blog/tcphandler-7a5f4eb307023f066db3ba2a77eaa318.jpg" alt="tcphandler"></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">trait</span> TcpHandlers <span class="token keyword">extends</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">{</span>\n\n  <span class="token keyword">override</span> <span class="token keyword">def</span> onMessage<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n    notifyListener<span class="token punctuation">(</span>\n      <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">,</span> \n      InboundPayload<span class="token punctuation">(</span>ByteString<span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span></code></pre>\n      </div>\n<p>The above <code class="language-text">notifyListener</code>  method is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala">  <span class="token keyword">def</span> notifyListener<span class="token punctuation">(</span>channel<span class="token operator">:</span> Channel<span class="token punctuation">,</span> msg<span class="token operator">:</span> HandleEvent<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> \n    get<span class="token punctuation">(</span>channel<span class="token punctuation">)</span> foreach <span class="token punctuation">{</span> _ notify msg <span class="token punctuation">}</span></code></pre>\n      </div>\n<p>and <code class="language-text">notify</code> performs usual local message passing via the familiar <code class="language-text">!</code> method, <code class="language-text">actor ! ev</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">  final case class ActorHandleEventListener(actor: ActorRef) \n    extends HandleEventListener {\n    \n    override def notify(ev: HandleEvent): Unit =\n      actor ! ev\n  }</code></pre>\n      </div>\n<h3>EndPointReader and de-serialization</h3>\n<p><img src="/blog/deserialize-de187b0aca391605b3c8af965f49e7a7.jpg" alt="deserialize"></p>\n<p>There are some intermediate actor(s) passes through the payload after the <code class="language-text">notify</code> method described above (in the case of this example, <code class="language-text">AkkaProtocolManager</code>).</p>\n<p>Afterwards, an important <code class="language-text">EndpointReader</code> actor receives the payload. It has the following <code class="language-text">receive</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">class</span> EndpointReader<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">override</span> <span class="token keyword">def</span> receive<span class="token operator">:</span> Receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> InboundPayload<span class="token punctuation">(</span>p<span class="token punctuation">)</span> <span class="token keyword">if</span> p<span class="token punctuation">.</span>size <span class="token operator">&lt;=</span> transport<span class="token punctuation">.</span>maximumPayloadBytes ⇒\n      <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>     \n      msgDispatch<span class="token punctuation">.</span>dispatch<span class="token punctuation">(</span>\n        msg<span class="token punctuation">.</span>recipient<span class="token punctuation">,</span>\n        msg<span class="token punctuation">.</span>recipientAddress<span class="token punctuation">,</span>\n        <span class="token comment">// msg.serializedMessage.message: ByteString </span>\n        msg<span class="token punctuation">.</span>serializedMessage<span class="token punctuation">,</span>\n        msg<span class="token punctuation">.</span>senderOption\n      <span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>        </code></pre>\n      </div>\n<p>When <code class="language-text">EndPointReader</code> receives the payload, it is de-serialized from a serialized byte array (represented as <code class="language-text">ByteString</code>) to a Scala object, with the following call in <code class="language-text">DefaultMessageDispatcher</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">class DefaultMessageDispatcher(\n    ...\n    lazy val payload: AnyRef =\n      MessageSerializer.deserialize(\n        system, \n        serializedMessage\n      )\n    ...\n}</code></pre>\n      </div>\n<p><code class="language-text">msgDispatch.dispatch</code> in <code class="language-text">EndPointReader</code> finally passes the deserialized message to the <code class="language-text">MessageReceiver</code> actor via local message passing.</p>\n<p><img src="/blog/receiver-5310b90ed8761a134f9b10a3a878337f.jpg" alt="receiver"></p>\n<h2>Instruction to run the example, and output</h2>\n<p>As this example uses <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">Akka remoting</a> to send a message,\nyou need to run two JVMs for the receiver and sender of the application respectively.</p>\n<p>Firstly, run the receiver side with the <code class="language-text">receiver</code> argument supplied to <code class="language-text">Main</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; git clone https://github.com/richardimaoka/resources.git\n&gt; cd resources\n&gt; cd remote-minimal\n&gt; sbt\n&gt; runMain example.Main receiver</code></pre>\n      </div>\n<p>You’ll get output like below, then it waits until the message is sent from the sender.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; runMain example.Main receiver\n[info] Running example.Main receiver\nProgram args:\nreceiver\nrunning startMessageReceiver()\n[INFO] [02/03/2018 13:36:58.281] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:36:58.462] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://receiverSystem@127.0.0.1:2551]\n[INFO] [02/03/2018 13:36:58.464] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://receiverSystem@127.0.0.1:2551]\nprovider = remote\nlistening at port = 2551\nstarted a receiver actor = Actor[akka://receiverSystem/user/receiver#-603875191]</code></pre>\n      </div>\n<p>Then in the same directory, run the same <code class="language-text">Main</code> with <code class="language-text">sender</code> as the argument</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; sbt\n&gt; runMain example.Main sender</code></pre>\n      </div>\n<p>this is the sender side output:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] Running example.Main sender\nProgram args:\nsender\nrunning startMessageSender()\n[INFO] [02/03/2018 13:37:16.215] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:37:16.427] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://senderSystem@127.0.0.1:2552]\n[INFO] [02/03/2018 13:37:16.432] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://senderSystem@127.0.0.1:2552]\nprovider = remote\nlistening at port = 2552\nsending a message to akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver\n[INFO] [02/03/2018 13:37:19.533] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:37:19.537] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.actor.default-dispatcher-4] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remoting shut down.\n[success] Total time: 5 s, completed Feb 3, 2018 1:37:19 PM</code></pre>\n      </div>\n<p>then you see the receiver output as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">EchoActor: received message = Hello!!</code></pre>\n      </div>\n<p>and immediately after that, the receiver side shows this error, which can be ignored.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[ERROR] [02/03/2018 13:37:19.572] [receiverSystem-akka.remote.default-remote-dispatcher-15] [akka.tcp://receiverSystem@127.0.0.1:2551/system/endpointManager/reliableEndpointWriter-akka.tcp%3A%2F%2FsenderSystem%40127.0.0.1%3A2552-0/endpointWriter] AssociationError [akka.tcp://receiverSystem@127.0.0.1:2551] &lt;- [akka.tcp://senderSystem@127.0.0.1:2552]: Error [Shut down address: akka.tcp://senderSystem@127.0.0.1:2552] [\nakka.remote.ShutDownAssociation: Shut down address: akka.tcp://senderSystem@127.0.0.1:2552\nCaused by: akka.remote.transport.Transport$InvalidAssociationException: The remote system terminated the association because it is shutting down.\n]</code></pre>\n      </div>\n<p>As explained in <a href="https://groups.google.com/forum/#!topic/akka-user/eerWNwRQ7o0">this thrad in akka-user</a> mailing list, the error happens specifically when you launch a process like this example from sbt, but when you compile your application and run it witout sbt, then the error disappears.</p>\n<p>Once everything is done, press the enter key on the receiver side’s console and you get this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[INFO] [02/03/2018 13:38:05.942] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:38:05.944] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.actor.default-dispatcher-3] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.remote.default-remote-dispatcher-6] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remoting shut down.</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka remoting at <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">https://doc.akka.io/docs/akka/2.5/remoting.html</a></li>\n<li>Official documentation of Akka serialization at <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">https://doc.akka.io/docs/akka/2.5/serialization.html</a></li>\n<li>Netty documentation at <a href="https://netty.io/">https://netty.io/</a></li>\n</ul>',frontmatter:{title:"Akka remoting minimal example part 3 - receiver side",date:"February 09, 2018"}}},pathContext:{slug:"/remote-minimal-receiver/"}}}});
//# sourceMappingURL=path---remote-minimal-receiver-f36cb7864e9a98e8033b.js.map