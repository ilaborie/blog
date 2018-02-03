webpackJsonp([26725176786023],{509:function(a,e){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/persistent-actor-minimal-sql/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/persistent-actor-minimal-sql">GitHub</a>.\nThere is also an <a href="https://github.com/okumin/akka-persistence-sql-async/tree/master/sample/src/main">official sample</a> available.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/WcpEMcnx5XU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/sql-261553d2948cdc8dfb9ce07f93dbbd86-287be.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 16.083916083916083%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAADCAYAAACTWi8uAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAt0lEQVQI10WPy2rDMBBF8/9/lDYtZJPYYBqoHpYt7YotJUY2rV1cQ+BEVRddnRnucJi7G4aBaZoYx5EYI5P3dMbwURtCUdCdToSyxBcl/fmcWHBN++35wPXlFb9/wh+PzOnuHgK7dV3Zto1l+c786nuC1jjnMHWNlBJjGqTSvAuJTpm1NufOupyZ9ECMIz9N8y+c5yXzs+sISmFbi04UQmCaP2FVVYmKOgls26LSrKTg8nbJ7X6FD4891954O8n4AAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="sql"\n        title=""\n        src="/static/sql-261553d2948cdc8dfb9ce07f93dbbd86-fb8a0.png"\n        srcset="/static/sql-261553d2948cdc8dfb9ce07f93dbbd86-1a291.png 148w,\n/static/sql-261553d2948cdc8dfb9ce07f93dbbd86-2bc4a.png 295w,\n/static/sql-261553d2948cdc8dfb9ce07f93dbbd86-fb8a0.png 590w,\n/static/sql-261553d2948cdc8dfb9ce07f93dbbd86-287be.png 715w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Refer to another post, <a href="../persistent-actor-minimal">Persistence Actor Minimal example</a> for basics of PersistentActor.</p>\n<p>In this example, the target DB is MySQL. Firstly you need to create a database <code>akka_persistence_sql_async</code> and execute <a href="https://github.com/richardimaoka/resources/blob/master/persistent-actor-minimal-sql/mysql.sql"><code>mysql.sql</code></a> so that the database has necessary tables.</p>\n<p>In <a href="https://github.com/richardimaoka/resources/blob/master/persistent-actor-minimal-sql/src/main/scala/example/Main.scala#L28L38">MyPersistentAcdtor</a>, when <code>persist</code> method is called, an <code>Event</code> is sent to <a href="https://github.com/okumin/akka-persistence-sql-async/blob/8dba8158273dbf206ce4abca0725e28207b1db1b/core/src/main/scala/akka/persistence/journal/sqlasync/ScalikeJDBCWriteJournal.scala">ScalikeJDBCWriteJournal</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>   <span class="token keyword">override</span> <span class="token keyword">def</span> receiveCommand<span class="token operator">:</span> Receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> Command<span class="token punctuation">(</span>i<span class="token punctuation">)</span> ⇒\n      persist<span class="token punctuation">(</span>Event<span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n        <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n      <span class="token punctuation">}</span>\n   <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Then <a href="https://github.com/okumin/akka-persistence-sql-async/blob/8dba8158273dbf206ce4abca0725e28207b1db1b/core/src/main/scala/akka/persistence/journal/sqlasync/ScalikeJDBCWriteJournal.scala">ScalikeJDBCWriteJournal</a> serializes <code>Event</code> to <code>Array[Byte]</code> with <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">Akka serializer</a>. </p>\n<p>After that, <code>ScalikeJDBCWriteJournal</code> prepares an SQL statement to persist the data to an SQL database, including the <code>message</code> column to hold the binary of <code>Event</code>.</p>\n<h2>Instruction to run the example</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd persistent-actor-minimal-sql\n> sbt\n> runMain example.Main</code></pre>\n      </div>\n<h2>Output</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.Main\nreceiveCommand  : Received Command Command(1)\npersist callback: Event = Event(1) persisted\npersist callback: current state = 1\nreceiveCommand  : Received Command Command(2)\npersist callback: Event = Event(2) persisted\npersist callback: current state = 3\nreceiveCommand  : Received Command Command(3)\npersist callback: Event = Event(3) persisted\npersist callback: current state = 6\n[ERROR] [01/13/2018 17:24:19.422] [exampleSystem-akka.actor.default-dispatcher-7] [akka://exampleSystem/user/p1] exploded!\njava.lang.Exception: exploded!\n        at example.MyPersistentActor$$anonfun$receiveCommand$1.applyOrElse(Main.scala:37)\n        at akka.actor.Actor.aroundReceive(Actor.scala:517)\n        at akka.actor.Actor.aroundReceive$(Actor.scala:515)\n        at example.MyPersistentActor.akka$persistence$Eventsourced$$super$aroundReceive(Main.scala:11)\n        at akka.persistence.Eventsourced$$anon$1.stateReceive(Eventsourced.scala:663)\n        at akka.persistence.Eventsourced.aroundReceive(Eventsourced.scala:183)\n        at akka.persistence.Eventsourced.aroundReceive$(Eventsourced.scala:182)\n        at example.MyPersistentActor.aroundReceive(Main.scala:11)\n        at akka.actor.ActorCell.receiveMessage(ActorCell.scala:527)\n        at akka.actor.ActorCell.invoke(ActorCell.scala:496)\n        at akka.dispatch.Mailbox.processMailbox(Mailbox.scala:257)\n        at akka.dispatch.Mailbox.run(Mailbox.scala:224)\n        at akka.dispatch.Mailbox.exec(Mailbox.scala:234)\n        at akka.dispatch.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\n        at akka.dispatch.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\n        at akka.dispatch.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\n        at akka.dispatch.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\n\nreceiveRecover  : Recovering an event = Event(1)\nreceiveRecover  : current state = 1\nreceiveRecover  : Recovering an event = Event(2)\nreceiveRecover  : current state = 3\nreceiveRecover  : Recovering an event = Event(3)\nreceiveRecover  : current state = 6\nreceiveCommand  : Received Command Command(4)\npersist callback: Event = Event(4) persisted\npersist callback: current state = 10\nreceiveCommand  : Received Command Command(5)\npersist callback: Event = Event(5) persisted\npersist callback: current state = 15\n[success] Total time: 2 s, completed Jan 13, 2018 5:24:20 PM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official persistence documentation at <a href="https://doc.akka.io/docs/akka/2.5/persistence.html">https://doc.akka.io/docs/akka/2.5/persistence.html</a></li>\n<li>Official Akka serialization documentation at <a href="https://doc.akka.io/docs/akka/2.5/serialization.html">https://doc.akka.io/docs/akka/2.5/serialization.html</a></li>\n<li>akka-persistence-sql-async plugin at <a href="https://github.com/okumin/akka-persistence-sql-async">https://github.com/okumin/akka-persistence-sql-async</a></li>\n</ul>',frontmatter:{title:"PersistentActor minimal example with akka-persistence-sql-async",date:"January 17, 2018"}}},pathContext:{slug:"/persistent-actor-minimal-sql/"}}}});
//# sourceMappingURL=path---persistent-actor-minimal-sql-d86fe42a75dbcd1d685d.js.map