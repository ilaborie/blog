webpackJsonp([86659390886147],{420:function(a,n){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/local-minimal-receiver/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/LbuLAtN20HA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is continued from the previous article, <a href="../local-minimal-sender">Local Actor workflow part 1 - Sender side</a>. I would recommend you to read that article too.</p>\n<p>Also, later I am going to write the remote versions of articles to illustrate the message-sending/receiving behavior of Akka Actor when sending across different JVMs.</p>\n<h2>Workflow</h2>\n<p>As in bottom of the previous <a href="../local-minimal-sender">Local Actor workflow part 1 - Sender side</a> article, the below  <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L115">registerForExecution</a> method will let Java’s <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html"><code class="language-text">ExecutorService</code></a> process <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L56L57"><code class="language-text">Mailbox</code></a> , which is defined as <code class="language-text">ForkJoinTask</code>, to be executed on a different thread.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> registerForExecution<span class="token punctuation">(</span>mbox<span class="token operator">:</span> Mailbox<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Boolean</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  executorService execute mbox\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">abstract</span> <span class="token keyword">class</span> Mailbox<span class="token punctuation">(</span><span class="token keyword">val</span> messageQueue<span class="token operator">:</span> MessageQueue<span class="token punctuation">)</span>\n  <span class="token keyword">extends</span> ForkJoinTask<span class="token punctuation">[</span><span class="token builtin">Unit</span><span class="token punctuation">]</span> \n  <span class="token keyword">with</span> SystemMessageQueue \n  <span class="token keyword">with</span> Runnable <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>When <code class="language-text">ExecutorService</code> executes the <code class="language-text">Mailbox</code> as <code class="language-text">ForkJoinTask</code>, then the following <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/java/akka/dispatch/forkjoin/ForkJoinWorkerThread.java#L103"><code class="language-text">run</code> method of <code class="language-text">ForkJoinWorkerThread</code></a> is called:</p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code class="language-java"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span> </code></pre>\n      </div>\n<p>(Somehow a copy of ForkJoinWorkerThread from Java’s standard library is in akka’s source code … not sure why)</p>\n<p>The <code class="language-text">run</code> method above runs the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L250">following method of <code class="language-text">Mailbox</code></a></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token annotation punctuation">@tailrec</span> <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">def</span> processMailbox<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token comment">// def dequeue(): Envelope = messageQueue.dequeue()</span>\n  <span class="token keyword">val</span> next <span class="token operator">=</span> dequeue<span class="token punctuation">(</span><span class="token punctuation">)</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  actor invoke next\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  processMailbox<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>By <code class="language-text">dequeue</code>-ing an <code class="language-text">Envelope</code>, <code class="language-text">Mailbox</code> calls the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L488"><code class="language-text">invoke</code> method of <code class="language-text">ActorCell</code></a>, </p>\n<p><img src="/blog/processmailbox-94910b51aebb7b417483b0a787ba8151.jpg" alt="processmailbox"></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">final</span> <span class="token keyword">def</span> invoke<span class="token punctuation">(</span>messageHandle<span class="token operator">:</span> Envelope<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  receiveMessage<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>which unpacks the message from <code class="language-text">Envelope</code> then calls <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L527"><code class="language-text">receiveMessage</code> of <code class="language-text">ActorCell</code></a>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token comment">// def actor: Actor = ... in ActorCell</span>\n<span class="token keyword">final</span> <span class="token keyword">def</span> receiveMessage<span class="token punctuation">(</span>msg<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span>\n  actor<span class="token punctuation">.</span>aroundReceive<span class="token punctuation">(</span>behaviorStack<span class="token punctuation">.</span>head<span class="token punctuation">,</span> msg<span class="token punctuation">)</span></code></pre>\n      </div>\n<p><img src="/blog/receivemessage-e0b1f55a0e7451ee216a1da37f8b2e9c.jpg" alt="receivemessage"></p>\n<p>Here, <code class="language-text">Actor</code> has an important method called <code class="language-text">aroundReceive</code>, </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> aroundReceive<span class="token punctuation">(</span>receive<span class="token operator">:</span> Actor<span class="token punctuation">.</span>Receive<span class="token punctuation">,</span> msg<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>\n    receive<span class="token punctuation">.</span>applyOrElse<span class="token punctuation">(</span>msg<span class="token punctuation">,</span> Actor<span class="token punctuation">.</span>notHandledFun<span class="token punctuation">)</span>\n      <span class="token punctuation">.</span>asInstanceOf<span class="token punctuation">[</span><span class="token builtin">AnyRef</span><span class="token punctuation">]</span> eq Actor<span class="token punctuation">.</span>NotHandled\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    unhandled<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>which, as the name suggests, wraps around <code class="language-text">Actor</code>’s <code class="language-text">receive</code> method. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">class</span> MessageReceiver <span class="token keyword">extends</span> Actor <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> s<span class="token operator">:</span> <span class="token builtin">String</span> <span class="token keyword">=></span>\n      EchoActor<span class="token operator">:</span> received message <span class="token operator">=</span> $s"<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p><img src="/blog/receive-9bf14710a79d18dd691d0599f5f6ee4d.jpg" alt="receive"></p>\n<p>In <code class="language-text">aroundReceive</code> you can see <code class="language-text">receive.applyOrElse</code> is called, and if there is no match in <code class="language-text">receive</code>’s patter-match, it will call <code class="language-text">unhandled</code> of <code class="language-text">Actor</code>.</p>\n<p>Up to here, we have pretty much covered the receiver side of the behavior in actor’s message passing. Next up, I will go through how this changes when sending to a remote JVM.</p>\n<h2>Instruction to run the example</h2>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; git clone https://github.com/richardimaoka/resources.git\n&gt; cd resources\n&gt; cd local-minimal\n&gt; sbt\n&gt; runMain example.Main</code></pre>\n      </div>\n<h2>Output</h2>\n<p>Some <code class="language-text">println</code> calls are inserted in the <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">complete example at GitHub</a> to illustrate the behavior.</p>\n<p>Thread names are shown as [exampleSystem-akka.actor.default-dispatcher-3] and […-4].</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] Running example.Main\nprovider = local\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello World to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello Universe to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello World\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello Galaxy to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello Universe\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello Galaxy\n[success] Total time: 7 s, completed Jan 30, 2018 6:16:46 AM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka Actor at <a href="https://doc.akka.io/docs/akka/2.5/actors.html">https://doc.akka.io/docs/akka/2.5/actors.html</a></li>\n<li>Official documentation of Akka Dispatcher at <a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html">https://doc.akka.io/docs/akka/2.5/dispatchers.html</a></li>\n<li>Official documentation of Akka lifecycle at <a href="https://doc.akka.io/docs/akka/current/actors.html$actor-lifecycle">https://doc.akka.io/docs/akka/current/actors.html$actor-lifecycle</a></li>\n<li>Official documentation of Akka Mailbox at <a href="https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes">https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes</a>)</li>\n<li>Official documentation of Akka location transparency at <a href="https://doc.akka.io/docs/akka/current/general/remoting.html#location-transparency">https://doc.akka.io/docs/akka/current/general/remoting.html#location-transparency</a></li>\n<li>Oracle’s documentation about Fork/Join at <a href="https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html">https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html</a></li>\n<li>ExecutorService Javadoc at <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html</a></li>\n</ul>',frontmatter:{title:"Local Actor workflow part 2 - Receiver side",date:"January 29, 2018"}}},pathContext:{slug:"/local-minimal-receiver/"}}}});
//# sourceMappingURL=path---local-minimal-receiver-247eef626e6c2d4eb270.js.map