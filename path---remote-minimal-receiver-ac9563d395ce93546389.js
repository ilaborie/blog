webpackJsonp([0x61f1a292af65],{520:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/remote-minimal-receiver/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/remote-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/YAuamfYBb1o" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is the last of three articles about akka’s remote message passing. The previous articles are here:</p>\n<ul>\n<li><a href="../remote-minimal-setup">Akka remoting minimal example part 1 - setup</a></li>\n<li><a href="../remote-minimal-sender">Akka remoting minimal example part 2 - sender side</a></li>\n</ul>\n<h3>TcpHandlers</h3>\n<p>As in the previous article, Netty takes care of the message transport in the network layer.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMBBP/EABUBAQEAAAAAAAAAAAAAAAAAAAIE/9oADAMBAAIQAxAAAAHuWwxxXJ//xAAYEAADAQEAAAAAAAAAAAAAAAAAAhEBMf/aAAgBAQABBQI2xbFRVGM5/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECEf/aAAgBAwEBPwGZRh//xAAYEQADAQEAAAAAAAAAAAAAAAAAARECA//aAAgBAgEBPwFc4PNZ/8QAFxAAAwEAAAAAAAAAAAAAAAAAABAhAf/aAAgBAQAGPwJUmP8A/8QAGxABAQABBQAAAAAAAAAAAAAAAREAECExgZH/2gAIAQEAAT8h6fMlQNwvabiCyvOq/9oADAMBAAIAAwAAABCLD//EABYRAQEBAAAAAAAAAAAAAAAAAAEQIf/aAAgBAwEBPxADk//EABcRAQEBAQAAAAAAAAAAAAAAAAEAETH/2gAIAQIBAT8QFbCjy//EAB4QAQADAAAHAAAAAAAAAAAAAAEAESExQVFhcZHw/9oACAEBAAE/EBVQVOigWgjCmAk1u/CWuPKXfrZgPM0Vv3P/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="netty"\n        title=""\n        src="/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-f8fb9.jpg"\n        srcset="/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-e8976.jpg 148w,\n/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-63df2.jpg 295w,\n/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-f8fb9.jpg 590w,\n/blog/static/netty-96343e72e3f9855be8e66c37ed135e02-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Onc the receiver side, <code>TcpHandler</code> has the <code>onMessage</code> method, which is called when a message payload (serialized byte array) arrives on the receiver side. </p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/tcphandler-7a5f4eb307023f066db3ba2a77eaa318-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIEA//EABYBAQEBAAAAAAAAAAAAAAAAAAIABP/aAAwDAQACEAMQAAABparOxqUBH//EABoQAAICAwAAAAAAAAAAAAAAAAESAhEAEDH/2gAIAQEAAQUCizBro6j3P//EABYRAQEBAAAAAAAAAAAAAAAAAAASAf/aAAgBAwEBPwGcS//EABcRAQADAAAAAAAAAAAAAAAAAAABAhP/2gAIAQIBAT8BmrJ//8QAGRAAAgMBAAAAAAAAAAAAAAAAAREAAiAh/9oACAEBAAY/Ai6lToz/AP/EABoQAQADAAMAAAAAAAAAAAAAAAEAESEQQWH/2gAIAQEAAT8hTIQ7my4J4MveGp//2gAMAwEAAgADAAAAEBMf/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAERQVH/2gAIAQMBAT8QdhHT/8QAGREAAwADAAAAAAAAAAAAAAAAAAERIVGh/9oACAECAQE/EEuxLPCdn//EABsQAQACAwEBAAAAAAAAAAAAAAEAESExcUHx/9oACAEBAAE/EE+w0jDmcgik+FBtVxc069lecan/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="tcphandler"\n        title=""\n        src="/blog/static/tcphandler-7a5f4eb307023f066db3ba2a77eaa318-f8fb9.jpg"\n        srcset="/blog/static/tcphandler-7a5f4eb307023f066db3ba2a77eaa318-e8976.jpg 148w,\n/blog/static/tcphandler-7a5f4eb307023f066db3ba2a77eaa318-63df2.jpg 295w,\n/blog/static/tcphandler-7a5f4eb307023f066db3ba2a77eaa318-f8fb9.jpg 590w,\n/blog/static/tcphandler-7a5f4eb307023f066db3ba2a77eaa318-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">trait</span> TcpHandlers <span class="token keyword">extends</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">{</span>\n\n  <span class="token keyword">override</span> <span class="token keyword">def</span> onMessage<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n    notifyListener<span class="token punctuation">(</span>\n      <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">,</span> \n      InboundPayload<span class="token punctuation">(</span>ByteString<span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>The above <code>notifyListener</code>  method is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>  <span class="token keyword">def</span> notifyListener<span class="token punctuation">(</span>channel<span class="token operator">:</span> Channel<span class="token punctuation">,</span> msg<span class="token operator">:</span> HandleEvent<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> \n    get<span class="token punctuation">(</span>channel<span class="token punctuation">)</span> foreach <span class="token punctuation">{</span> _ notify msg <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>and <code>notify</code> performs usual local message passing via the familiar <code>!</code> method, <code>actor ! ev</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>  final case class ActorHandleEventListener(actor: ActorRef) \n    extends HandleEventListener {\n    \n    override def notify(ev: HandleEvent): Unit =\n      actor ! ev\n  }</code></pre>\n      </div>\n<h3>EndPointReader and de-serialization</h3>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/deserialize-de187b0aca391605b3c8af965f49e7a7-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgAE/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAEEBf/aAAwDAQACEAMQAAAB1JU+cJwv/8QAFxABAQEBAAAAAAAAAAAAAAAAEQEgIf/aAAgBAQABBQKK8jj/xAAVEQEBAAAAAAAAAAAAAAAAAAAQEf/aAAgBAwEBPwGn/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQACEf/aAAgBAgEBPwHT2W//xAAXEAADAQAAAAAAAAAAAAAAAAAAASAx/9oACAEBAAY/AjHP/8QAGBABAAMBAAAAAAAAAAAAAAAAAQARISD/2gAIAQEAAT8h02ZN2JNFonH/2gAMAwEAAgADAAAAEDff/8QAFhEBAQEAAAAAAAAAAAAAAAAAAREA/9oACAEDAQE/ECWzLXf/xAAXEQEBAQEAAAAAAAAAAAAAAAABEQBx/9oACAECAQE/EAdk5gWhN//EABkQAQADAQEAAAAAAAAAAAAAAAEAESEgMf/aAAgBAQABPxB12r5LIg7jjGeoaF2uP//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="deserialize"\n        title=""\n        src="/blog/static/deserialize-de187b0aca391605b3c8af965f49e7a7-f8fb9.jpg"\n        srcset="/blog/static/deserialize-de187b0aca391605b3c8af965f49e7a7-e8976.jpg 148w,\n/blog/static/deserialize-de187b0aca391605b3c8af965f49e7a7-63df2.jpg 295w,\n/blog/static/deserialize-de187b0aca391605b3c8af965f49e7a7-f8fb9.jpg 590w,\n/blog/static/deserialize-de187b0aca391605b3c8af965f49e7a7-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>There are some intermediate actor(s) passes through the payload after the <code>notify</code> method described above (in the case of this example, <code>AkkaProtocolManager</code>).</p>\n<p>Afterwards, an important <code>EndpointReader</code> actor receives the payload. It has the following <code>receive</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> EndpointReader<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">override</span> <span class="token keyword">def</span> receive<span class="token operator">:</span> Receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> InboundPayload<span class="token punctuation">(</span>p<span class="token punctuation">)</span> <span class="token keyword">if</span> p<span class="token punctuation">.</span>size <span class="token operator">&lt;=</span> transport<span class="token punctuation">.</span>maximumPayloadBytes ⇒\n      <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>     \n      msgDispatch<span class="token punctuation">.</span>dispatch<span class="token punctuation">(</span>\n        msg<span class="token punctuation">.</span>recipient<span class="token punctuation">,</span>\n        msg<span class="token punctuation">.</span>recipientAddress<span class="token punctuation">,</span>\n        <span class="token comment">// msg.serializedMessage.message: ByteString </span>\n        msg<span class="token punctuation">.</span>serializedMessage<span class="token punctuation">,</span>\n        msg<span class="token punctuation">.</span>senderOption\n      <span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>        \n</code></pre>\n      </div>\n<p>When <code>EndPointReader</code> receives the payload, it is de-serialized from a serialized byte array (represented as <code>ByteString</code>) to a Scala object, with the following call in <code>DefaultMessageDispatcher</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>class DefaultMessageDispatcher(\n    ...\n    lazy val payload: AnyRef =\n      MessageSerializer.deserialize(\n        system, \n        serializedMessage\n      )\n    ...\n}</code></pre>\n      </div>\n<p><code>msgDispatch.dispatch</code> in <code>EndPointReader</code> finally passes the deserialized message to the <code>MessageReceiver</code> actor via local message passing.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/receiver-5310b90ed8761a134f9b10a3a878337f-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgAE/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAEEBf/aAAwDAQACEAMQAAAB0p0+cJwv/8QAGRAAAgMBAAAAAAAAAAAAAAAAARECEBIh/9oACAEBAAEFAgTp8i1f/8QAFREBAQAAAAAAAAAAAAAAAAAAEBH/2gAIAQMBAT8Bp//EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAgEBPwFdZdb/xAAXEAADAQAAAAAAAAAAAAAAAAABECEg/9oACAEBAAY/AjFcf//EABkQAQEBAAMAAAAAAAAAAAAAAAERACAhUf/aAAgBAQABPyGQVDd1BHx1OB//2gAMAwEAAgADAAAAEEz/AP/EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAwEBPxBDbf/EABYRAQEBAAAAAAAAAAAAAAAAAAERAP/aAAgBAgEBPxAQZMaITf/EABwQAQACAQUAAAAAAAAAAAAAAAEAETEQIUFRcf/aAAgBAQABPxBPAk9yzt2UFMVwI35EHJADGn//2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="receiver"\n        title=""\n        src="/blog/static/receiver-5310b90ed8761a134f9b10a3a878337f-f8fb9.jpg"\n        srcset="/blog/static/receiver-5310b90ed8761a134f9b10a3a878337f-e8976.jpg 148w,\n/blog/static/receiver-5310b90ed8761a134f9b10a3a878337f-63df2.jpg 295w,\n/blog/static/receiver-5310b90ed8761a134f9b10a3a878337f-f8fb9.jpg 590w,\n/blog/static/receiver-5310b90ed8761a134f9b10a3a878337f-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<h2>Instruction to run the example, and output</h2>\n<p>As this example uses <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">Akka remoting</a> to send a message,\nyou need to run two JVMs for the receiver and sender of the application respectively.</p>\n<p>Firstly, run the receiver side with the <code>receiver</code> argument supplied to <code>Main</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd remote-minimal\n> sbt\n> runMain example.Main receiver</code></pre>\n      </div>\n<p>You’ll get output like below, then it waits until the message is sent from the sender.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.Main receiver\n[info] Running example.Main receiver\nProgram args:\nreceiver\nrunning startMessageReceiver()\n[INFO] [02/03/2018 13:36:58.281] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:36:58.462] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://receiverSystem@127.0.0.1:2551]\n[INFO] [02/03/2018 13:36:58.464] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://receiverSystem@127.0.0.1:2551]\nprovider = remote\nlistening at port = 2551\nstarted a receiver actor = Actor[akka://receiverSystem/user/receiver#-603875191]</code></pre>\n      </div>\n<p>Then in the same directory, run the same <code>Main</code> with <code>sender</code> as the argument</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> sbt\n> runMain example.Main sender</code></pre>\n      </div>\n<p>this is the sender side output:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.Main sender\nProgram args:\nsender\nrunning startMessageSender()\n[INFO] [02/03/2018 13:37:16.215] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:37:16.427] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://senderSystem@127.0.0.1:2552]\n[INFO] [02/03/2018 13:37:16.432] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://senderSystem@127.0.0.1:2552]\nprovider = remote\nlistening at port = 2552\nsending a message to akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver\n[INFO] [02/03/2018 13:37:19.533] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:37:19.537] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.actor.default-dispatcher-4] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remoting shut down.\n[success] Total time: 5 s, completed Feb 3, 2018 1:37:19 PM</code></pre>\n      </div>\n<p>then you see the receiver output as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>EchoActor: received message = Hello!!</code></pre>\n      </div>\n<p>and immediately after that, the receiver side shows this error, which can be ignored.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[ERROR] [02/03/2018 13:37:19.572] [receiverSystem-akka.remote.default-remote-dispatcher-15] [akka.tcp://receiverSystem@127.0.0.1:2551/system/endpointManager/reliableEndpointWriter-akka.tcp%3A%2F%2FsenderSystem%40127.0.0.1%3A2552-0/endpointWriter] AssociationError [akka.tcp://receiverSystem@127.0.0.1:2551] <- [akka.tcp://senderSystem@127.0.0.1:2552]: Error [Shut down address: akka.tcp://senderSystem@127.0.0.1:2552] [\nakka.remote.ShutDownAssociation: Shut down address: akka.tcp://senderSystem@127.0.0.1:2552\nCaused by: akka.remote.transport.Transport$InvalidAssociationException: The remote system terminated the association because it is shutting down.\n]</code></pre>\n      </div>\n<p>As explained in <a href="https://groups.google.com/forum/#!topic/akka-user/eerWNwRQ7o0">this thrad in akka-user</a> mailing list, the error happens specifically when you launch a process like this example from sbt, but when you compile your application and run it witout sbt, then the error disappears.</p>\n<p>Once everything is done, press the enter key on the receiver side’s console and you get this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[INFO] [02/03/2018 13:38:05.942] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:38:05.944] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.actor.default-dispatcher-3] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.remote.default-remote-dispatcher-6] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remoting shut down.</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka remoting at <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">https://doc.akka.io/docs/akka/2.5/remoting.html</a></li>\n<li>Official documentation of Akka serialization at <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">https://doc.akka.io/docs/akka/2.5/serialization.html</a></li>\n<li>Netty documentation at <a href="https://netty.io/">https://netty.io/</a></li>\n</ul>',frontmatter:{title:"Akka remoting minimal example part 3 - receiver side",date:"February 09, 2018"}}},pathContext:{slug:"/remote-minimal-receiver/"}}}});
//# sourceMappingURL=path---remote-minimal-receiver-ac9563d395ce93546389.js.map