webpackJsonp([0xcc61679d5045],{500:function(a,e){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/event-adapter-cassandra/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/event-adapter-tagging-cassandra">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/cIau92KiNiE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/cqlsh-43c57ec5e10939f5112d19aa98ca4a50-fcf37.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 24.324324324324326%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAFCAYAAABFA8wzAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAA+ElEQVQY03WP6UuEUBTFrzDquMxooONCgeuoUDQtRBRURAv9/+SoH9T/5Mx7F6IF+nC45573zu/x6HO/R9d1GPoewzBgHEdM0/RL8zxzLs/l3Z/qRW8vGG3bssj3fbiuiyAIeG42G9i2DV3XYZomHMfBer3mzDAMKIoCIvpflmUxTFVVaJoGz/N4l2A5wzBEkiSoqgrb7ZaV5zmKomCfZRn7NE1R1zVotbK5KF82lgvhfURRxJKwOI658AWUsyxLLv/1TdOAPG+BlydCHBKOXMJySQL+/YWTY8LdLeHxnnB9QTg/Jbw9Ez5eCQ8iu7ki7M4IlzvCu8gPmNKsjS+tLm8AAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="cqlsh"\n        title=""\n        src="/static/cqlsh-43c57ec5e10939f5112d19aa98ca4a50-fb8a0.png"\n        srcset="/static/cqlsh-43c57ec5e10939f5112d19aa98ca4a50-1a291.png 148w,\n/static/cqlsh-43c57ec5e10939f5112d19aa98ca4a50-2bc4a.png 295w,\n/static/cqlsh-43c57ec5e10939f5112d19aa98ca4a50-fb8a0.png 590w,\n/static/cqlsh-43c57ec5e10939f5112d19aa98ca4a50-fcf37.png 740w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>You firstly need <a href="https://github.com/richardimaoka/resources/blob/master/event-adapter-tagging-cassandra/src/main/resources/application.conf#L26L33">configuration</a> to tie up <code>MyEventAdapter</code> under the <code>example</code> package, and <code>Event</code> under the same <code>example</code> package.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>cassandra-journal {\n  event-adapters {\n    tagging-adapter = "example.MyEventAdapter"\n  }\n  event-adapter-bindings {\n    "example.Event" = tagging-adapter\n  }\n}</code></pre>\n      </div>\n<p>In <a href="https://github.com/richardimaoka/resources/blob/master/event-adapter-tagging-cassandra/src/main/scala/example/Main.scala#L28L38">MyPersistentAcdtor</a>, when <code>persist</code> method is called, an <code>Event</code> is sent to <a href="https://github.com/akka/akka-persistence-cassandra/blob/bf6bcbfa5d5616a285872ff605430c5b18ea289c/core/src/main/scala/akka/persistence/cassandra/journal/CassandraJournal.scala#L42">CassandraJournal</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>   <span class="token keyword">override</span> <span class="token keyword">def</span> receiveCommand<span class="token operator">:</span> Receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> Command<span class="token punctuation">(</span>i<span class="token punctuation">)</span> ⇒\n      persist<span class="token punctuation">(</span>Event<span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n        <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n      <span class="token punctuation">}</span>\n   <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Then <a href="https://github.com/akka/akka-persistence-cassandra/blob/bf6bcbfa5d5616a285872ff605430c5b18ea289c/core/src/main/scala/akka/persistence/cassandra/journal/CassandraJournal.scala#L42">CassandraJournal</a> invokes the <code>toJournal</code> method of <a href="https://github.com/richardimaoka/resources/blob/master/event-adapter-tagging-cassandra/src/main/scala/example/MyEventAdapter.scala#L9">MyEventAdapter.scala</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>  <span class="token keyword">override</span> <span class="token keyword">def</span> toJournal<span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Any</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">val</span> tags <span class="token operator">=</span> Set<span class="token punctuation">(</span><span class="token string">"mytag1"</span><span class="token punctuation">,</span> <span class="token string">"mytag2"</span><span class="token punctuation">)</span>\n    Tagged<span class="token punctuation">(</span>event<span class="token punctuation">,</span> tags<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>  \n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>After that, <code>Tagged(event, tags)</code> is serialized to <code>Array[Byte]</code> </p>\n<p>In more detail, <a href="https://github.com/akka/akka-persistence-cassandra/blob/bf6bcbfa5d5616a285872ff605430c5b18ea289c/core/src/main/scala/akka/persistence/cassandra/journal/CassandraJournal.scala#L42">CassandraJournal</a>’s <a href="https://github.com/akka/akka-persistence-cassandra/blob/bf6bcbfa5d5616a285872ff605430c5b18ea289c/core/src/main/scala/akka/persistence/cassandra/journal/CassandraJournal.scala#L464"><code>def serializeEvent()</code></a> method serializes <code>payload</code> (in this example, <code>Tagged(event, tags)</code>) to  <code>Array[Byte]</code> with <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">Akka serializer</a>. After that, <code>CassandraJournal</code> prepares a CQL statement to set all necessary columns in Cassandra, including the <code>event</code> column to hold the binary of <code>Tagged(event, tags)</code>.</p>\n<h2>Instruction to run the example</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd event-adapter-tagging-cassandra\n> sbt\n> runMain example.Main</code></pre>\n      </div>\n<h2>Output</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.Main\n[info] Running example.Main\nreceiveCommand  : Received Command(1)\nEventAdapter    : toJournal called for event = Event(1), tags = Set(mytag1, mytag2)\n[WARN] [SECURITY][01/17/2018 05:59:44.106] [exampleSystem-cassandra-plugin-default-dispatcher-8] [akka.serialization.Serialization(akka://exampleSystem)] Using the default Java serializer for class [example.Event] which is not recommended because of performance implications. Use another serializer or disable this warning using the setting \'akka.actor.warn-about-java-serializer-usage\'\npersist callback: Event = Event(1) persisted\npersist callback: current state = 1\nreceiveCommand  : Received Command(2)\nEventAdapter    : toJournal called for event = Event(2), tags = Set(mytag1, mytag2)\npersist callback: Event = Event(2) persisted\npersist callback: current state = 3\nreceiveCommand  : Received Command(3)\nEventAdapter    : toJournal called for event = Event(3), tags = Set(mytag1, mytag2)\npersist callback: Event = Event(3) persisted\npersist callback: current state = 6\n[ERROR] [01/17/2018 05:59:45.538] [exampleSystem-akka.actor.default-dispatcher-12] [akka://exampleSystem/user/p1] exploded!\njava.lang.Exception: exploded!\n        at example.MyPersistentActor$$anonfun$receiveCommand$1.applyOrElse(Main.scala:37)\n        at akka.actor.Actor.aroundReceive(Actor.scala:517)\n        at akka.actor.Actor.aroundReceive$(Actor.scala:515)\n        at example.MyPersistentActor.akka$persistence$Eventsourced$$super$aroundReceive(Main.scala:11)\n        at akka.persistence.Eventsourced$$anon$1.stateReceive(Eventsourced.scala:680)\n        at akka.persistence.Eventsourced.aroundReceive(Eventsourced.scala:192)\n        at akka.persistence.Eventsourced.aroundReceive$(Eventsourced.scala:191)\n        at example.MyPersistentActor.aroundReceive(Main.scala:11)\n        at akka.actor.ActorCell.receiveMessage(ActorCell.scala:527)\n        at akka.actor.ActorCell.invoke(ActorCell.scala:496)\n        at akka.dispatch.Mailbox.processMailbox(Mailbox.scala:257)\n        at akka.dispatch.Mailbox.run(Mailbox.scala:224)\n        at akka.dispatch.Mailbox.exec(Mailbox.scala:234)\n        at akka.dispatch.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\n        at akka.dispatch.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\n        at akka.dispatch.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\n        at akka.dispatch.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\n\nEventAdapter    : fromJournal called for event = Event(1) and manifest =\nEventAdapter    : fromJournal called for event = Event(2) and manifest =\nEventAdapter    : fromJournal called for event = Event(3) and manifest =\nreceiveRecover  : Recovering an event = Event(1)\nreceiveRecover  : current state = 1\nreceiveRecover  : Recovering an event = Event(2)\nreceiveRecover  : current state = 3\nreceiveRecover  : Recovering an event = Event(3)\nreceiveRecover  : current state = 6\nreceiveCommand  : Received Command(4)\nEventAdapter    : toJournal called for event = Event(4), tags = Set(mytag1, mytag2)\npersist callback: Event = Event(4) persisted\npersist callback: current state = 10\nreceiveCommand  : Received Command(5)\nEventAdapter    : toJournal called for event = Event(5), tags = Set(mytag1, mytag2)\npersist callback: Event = Event(5) persisted\npersist callback: current state = 15\n[success] Total time: 12 s, completed Jan 17, 2018 5:59:52 AM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official persistence documentation at <a href="https://doc.akka.io/docs/akka/2.5/persistence.html">https://doc.akka.io/docs/akka/2.5/persistence.html</a></li>\n<li>Official event adapter documentation for tagging at <a href="https://doc.akka.io/docs/akka/2.5/persistence.html#event-adapters">https://doc.akka.io/docs/akka/2.5/persistence.html#event-adapters</a></li>\n<li>Official Akka serialization documentation at <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">https://doc.akka.io/docs/akka/2.5/serialization.html</a></li>\n<li>akka-persistence-cassandra at <a href="https://github.com/akka/akka-persistence-cassandra">https://github.com/akka/akka-persistence-cassandra</a></li>\n<li>Apache Cassandra downloading page at <a href="http://cassandra.apache.org/download/">http://cassandra.apache.org/download/</a></li>\n<li>Datastax provides a great deal of documentation about Cassandra, including a free course avaialble as of the time of this blog post <a href="https://academy.datastax.com/courses">https://academy.datastax.com/courses</a></li>\n</ul>',frontmatter:{title:"Event Adapter with akka-persistence-cassandra",date:"January 16, 2018"}}},pathContext:{slug:"/event-adapter-cassandra/"}}}});
//# sourceMappingURL=path---event-adapter-cassandra-586d6466e6d564cdeb9b.js.map