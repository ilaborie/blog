webpackJsonp([86659390886147],{505:function(a,n){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/local-minimal-receiver/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/LbuLAtN20HA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is continued from the previous article, <a href="../local-minimal-sender">Local Actor workflow part 1 - Sender side</a>. I would recommend you to read that article too.</p>\n<p>Also, later I am going to write the remote versions of articles to illustrate the message-sending/receiving behavior of Akka Actor when sending across different JVMs.</p>\n<h2>Workflow</h2>\n<p>As in bottom of the previous <a href="../local-minimal-sender">Local Actor workflow part 1 - Sender side</a> article, the below  <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L115">registerForExecution</a> method will let Java’s <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html"><code>ExecutorService</code></a> process <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L56L57"><code>Mailbox</code></a> , which is defined as <code>ForkJoinTask</code>, to be executed on a different thread.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> registerForExecution<span class="token punctuation">(</span>mbox<span class="token operator">:</span> Mailbox<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Boolean</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  executorService execute mbox\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">abstract</span> <span class="token keyword">class</span> Mailbox<span class="token punctuation">(</span><span class="token keyword">val</span> messageQueue<span class="token operator">:</span> MessageQueue<span class="token punctuation">)</span>\n  <span class="token keyword">extends</span> ForkJoinTask<span class="token punctuation">[</span><span class="token builtin">Unit</span><span class="token punctuation">]</span> \n  <span class="token keyword">with</span> SystemMessageQueue \n  <span class="token keyword">with</span> Runnable <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>When <code>ExecutorService</code> executes the <code>Mailbox</code> as <code>ForkJoinTask</code>, then the following <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/java/akka/dispatch/forkjoin/ForkJoinWorkerThread.java#L103"><code>run</code> method of <code>ForkJoinWorkerThread</code></a> is called:</p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span> \n</code></pre>\n      </div>\n<p>(Somehow a copy of ForkJoinWorkerThread from Java’s standard library is in akka’s source code … not sure why)</p>\n<p>The <code>run</code> method above runs the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L250">following method of <code>Mailbox</code></a></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token annotation punctuation">@tailrec</span> <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">def</span> processMailbox<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token comment">// def dequeue(): Envelope = messageQueue.dequeue()</span>\n  <span class="token keyword">val</span> next <span class="token operator">=</span> dequeue<span class="token punctuation">(</span><span class="token punctuation">)</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  actor invoke next\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  processMailbox<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>By <code>dequeue</code>-ing an <code>Envelope</code>, <code>Mailbox</code> calls the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L488"><code>invoke</code> method of <code>ActorCell</code></a>, </p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/processmailbox-94910b51aebb7b417483b0a787ba8151-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMBAgX/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHWddSMJB//xAAZEAADAAMAAAAAAAAAAAAAAAAAAQIQEzH/2gAIAQEAAQUCl3spi5hH/8QAFREBAQAAAAAAAAAAAAAAAAAAARD/2gAIAQMBAT8BJ//EABYRAQEBAAAAAAAAAAAAAAAAAAEQEf/aAAgBAgEBPwFdn//EABcQAQADAAAAAAAAAAAAAAAAAAERICL/2gAIAQEABj8CZM2//8QAGRAAAgMBAAAAAAAAAAAAAAAAAAERITFR/9oACAEBAAE/IUlO4IFVvg8h4SzCP//aAAwDAQACAAMAAAAQQA//xAAXEQADAQAAAAAAAAAAAAAAAAABEBEx/9oACAEDAQE/EAmmr//EABYRAQEBAAAAAAAAAAAAAAAAABEQMf/aAAgBAgEBPxBGE//EABwQAAICAgMAAAAAAAAAAAAAAAERACFBgVFxwf/aAAgBAQABPxAI4Da9XmUwGlAUTEB1n2ULqOJZxCZjxP/Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="processmailbox"\n        title=""\n        src="/blog/static/processmailbox-94910b51aebb7b417483b0a787ba8151-f8fb9.jpg"\n        srcset="/blog/static/processmailbox-94910b51aebb7b417483b0a787ba8151-e8976.jpg 148w,\n/blog/static/processmailbox-94910b51aebb7b417483b0a787ba8151-63df2.jpg 295w,\n/blog/static/processmailbox-94910b51aebb7b417483b0a787ba8151-f8fb9.jpg 590w,\n/blog/static/processmailbox-94910b51aebb7b417483b0a787ba8151-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">final</span> <span class="token keyword">def</span> invoke<span class="token punctuation">(</span>messageHandle<span class="token operator">:</span> Envelope<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  receiveMessage<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>which unpacks the message from <code>Envelope</code> then calls <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L527"><code>receiveMessage</code> of <code>ActorCell</code></a>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token comment">// def actor: Actor = ... in ActorCell</span>\n<span class="token keyword">final</span> <span class="token keyword">def</span> receiveMessage<span class="token punctuation">(</span>msg<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span>\n  actor<span class="token punctuation">.</span>aroundReceive<span class="token punctuation">(</span>behaviorStack<span class="token punctuation">.</span>head<span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMBAgX/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHVfdSMJB//xAAaEAACAgMAAAAAAAAAAAAAAAAAAQIREyEx/9oACAEBAAEFAlKeRvS4WI//xAAVEQEBAAAAAAAAAAAAAAAAAAABEP/aAAgBAwEBPwEn/8QAFhEBAQEAAAAAAAAAAAAAAAAAARAR/9oACAECAQE/AV2f/8QAFxABAAMAAAAAAAAAAAAAAAAAAREgIf/aAAgBAQAGPwJky3//xAAaEAACAwEBAAAAAAAAAAAAAAAAARExUSFB/9oACAEBAAE/IVEuyeFdweQ6JaUR/9oADAMBAAIAAwAAABDQD//EABcRAAMBAAAAAAAAAAAAAAAAAAEQETH/2gAIAQMBAT8QCDav/8QAFREBAQAAAAAAAAAAAAAAAAAAERD/2gAIAQIBAT8QQhP/xAAdEAACAgEFAAAAAAAAAAAAAAABEQAhQVFhcYHB/9oACAEBAAE/EBUwt7W15hwxSyQoxAes+yhcQFJtCZjpP//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="receivemessage"\n        title=""\n        src="/blog/static/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c-f8fb9.jpg"\n        srcset="/blog/static/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c-e8976.jpg 148w,\n/blog/static/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c-63df2.jpg 295w,\n/blog/static/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c-f8fb9.jpg 590w,\n/blog/static/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Here, <code>Actor</code> has an important method called <code>aroundReceive</code>, </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> aroundReceive<span class="token punctuation">(</span>receive<span class="token operator">:</span> Actor<span class="token punctuation">.</span>Receive<span class="token punctuation">,</span> msg<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>\n    receive<span class="token punctuation">.</span>applyOrElse<span class="token punctuation">(</span>msg<span class="token punctuation">,</span> Actor<span class="token punctuation">.</span>notHandledFun<span class="token punctuation">)</span>\n      <span class="token punctuation">.</span>asInstanceOf<span class="token punctuation">[</span><span class="token builtin">AnyRef</span><span class="token punctuation">]</span> eq Actor<span class="token punctuation">.</span>NotHandled\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    unhandled<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>which, as the name suggests, wraps around <code>Actor</code>’s <code>receive</code> method. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> MessageReceiver <span class="token keyword">extends</span> Actor <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> s<span class="token operator">:</span> <span class="token builtin">String</span> <span class="token keyword">=></span>\n      EchoActor<span class="token operator">:</span> received message <span class="token operator">=</span> $s"<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/receive-9bf14710a79d18dd691d0599f5f6ee4d-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAECAwX/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHWvmkQwf/EABoQAQABBQAAAAAAAAAAAAAAAAECAxATITH/2gAIAQEAAQUCi1MjoOX/AP/EABURAQEAAAAAAAAAAAAAAAAAAAEQ/9oACAEDAQE/ASf/xAAWEQEBAQAAAAAAAAAAAAAAAAABEBH/2gAIAQIBAT8BXZ//xAAWEAEBAQAAAAAAAAAAAAAAAAABICL/2gAIAQEABj8CRM1//8QAGRABAAIDAAAAAAAAAAAAAAAAAQARIEFR/9oACAEBAAE/IUVDRjejHeD/2gAMAwEAAgADAAAAEBDP/8QAFxEBAAMAAAAAAAAAAAAAAAAAARARMf/aAAgBAwEBPxAUbH//xAAWEQEBAQAAAAAAAAAAAAAAAAAREDH/2gAIAQIBAT8QRhP/xAAdEAACAQQDAAAAAAAAAAAAAAABEQAgIUFRgaHB/9oACAEBAAE/EDCBNnS3HEAuAQs4gPGfaP/Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="receive"\n        title=""\n        src="/blog/static/receive-9bf14710a79d18dd691d0599f5f6ee4d-f8fb9.jpg"\n        srcset="/blog/static/receive-9bf14710a79d18dd691d0599f5f6ee4d-e8976.jpg 148w,\n/blog/static/receive-9bf14710a79d18dd691d0599f5f6ee4d-63df2.jpg 295w,\n/blog/static/receive-9bf14710a79d18dd691d0599f5f6ee4d-f8fb9.jpg 590w,\n/blog/static/receive-9bf14710a79d18dd691d0599f5f6ee4d-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>In <code>aroundReceive</code> you can see <code>receive.applyOrElse</code> is called, and if there is no match in <code>receive</code>’s patter-match, it will call <code>unhandled</code> of <code>Actor</code>.</p>\n<p>Up to here, we have pretty much covered the receiver side of the behavior in actor’s message passing. Next up, I will go through how this changes when sending to a remote JVM.</p>\n<h2>Instruction to run the example</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd local-minimal\n> sbt\n> runMain example.Main</code></pre>\n      </div>\n<h2>Output</h2>\n<p>Some <code>println</code> calls are inserted in the <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">complete example at GitHub</a> to illustrate the behavior.</p>\n<p>Thread names are shown as [exampleSystem-akka.actor.default-dispatcher-3] and […-4].</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.Main\nprovider = local\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello World to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello Universe to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello World\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello Galaxy to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello Universe\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello Galaxy\n[success] Total time: 7 s, completed Jan 30, 2018 6:16:46 AM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka Actor at <a href="https://doc.akka.io/docs/akka/2.5/actors.html">https://doc.akka.io/docs/akka/2.5/actors.html</a></li>\n<li>Official documentation of Akka Dispatcher at <a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html">https://doc.akka.io/docs/akka/2.5/dispatchers.html</a></li>\n<li>Official documentation of Akka lifecycle at <a href="https://doc.akka.io/docs/akka/current/actors.html$actor-lifecycle">https://doc.akka.io/docs/akka/current/actors.html$actor-lifecycle</a></li>\n<li>Official documentation of Akka Mailbox at <a href="https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes">https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes</a>)</li>\n<li>Official documentation of Akka location transparency at <a href="https://doc.akka.io/docs/akka/current/general/remoting.html#location-transparency">https://doc.akka.io/docs/akka/current/general/remoting.html#location-transparency</a></li>\n<li>Oracle’s documentation about Fork/Join at <a href="https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html">https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html</a></li>\n<li>ExecutorService Javadoc at <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html</a></li>\n</ul>',frontmatter:{title:"Local Actor workflow part 2 - Receiver side",date:"January 29, 2018"}}},pathContext:{slug:"/local-minimal-receiver/"}}}});
//# sourceMappingURL=path---local-minimal-receiver-82e73a8bfb4d764c9640.js.map