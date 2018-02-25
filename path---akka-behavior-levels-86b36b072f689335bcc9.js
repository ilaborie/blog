webpackJsonp([0xda7ccff596ad],{511:function(e,o){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/akka-behavior-levels/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/hHNmGxf7Mwc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>As we went through the Akka internal behavior in previous articles, let’s review it from a high/conceptual level to a low/internal level where you see an Akka application as a huge <code>ForkJoinTask</code> application (although it doesn’t use fork-join mechanism).</p>\n<p>Previous articles related to this post are here:</p>\n<ul>\n<li><a href="../local-minimal-sender/">Local Actor workflow part 1 - Sender side</a></li>\n<li><a href="../local-minimal-receiver/">Local Actor workflow part 2 - Receiver side</a></li>\n<li><a href="../dispatcher-behavior/">Dispatcher behavior</a></li>\n<li><a href="../mailbox-and-fork-join-task/">Mailbox and ForkJoinTask</a></li>\n</ul>\n<h2>The highest level: Actors pass messages</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/x5GEmjyJD2U" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>If you ever heard of Akka, or an actor model in general, you might know that actors, which are minimal components consisting of your entire application, communicate to each other by passing messages.</p>\n<p>This is usually what people would mention when they try to explain the actor model to those who never heard of it.</p>\n<h2>The second level: Actor’s ! and receive methods</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/FNlqhNrKsLQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>The next level touches something specific to Akka. If you have experience programming an application using Akka, you would know that Akka provides:</p>\n<ul>\n<li>The <code>!</code> method in <code>ActorRef</code> to send a message to an <code>Actor</code></li>\n<li>The <code>receive</code> method in <code>Actor</code> which you need to implement in your concrete <code>Actor</code> class, and the <code>receive</code> method processes incoming messages</li>\n</ul>\n<p>For those who don’t need to interact with Akka day to day, knowing what the <code>!</code> and <code>receive</code> methods are helps them understand Akka-based applications written by someone else.</p>\n<p>Or with this level of knowledge, you can still implement your important (so-called domain or business) logic for your application inside the <code>receive</code> method. Then Akka takes care of actual execution of the <code>receive</code> method in a multi-threaded environment, but you are not yet exposed to how threads are employed by Akka to power your application.</p>\n<p>Let’s go to the next level for more serious Akka users. We are going to look at <code>MessageQueue</code></p>\n<h2>The third level: MessageQueue</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/o0UtYvGacWQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>A <code>MessageQueue</code> in Akka is something sits in-between your sender <code>Actor</code> and the receiver <code>Actor</code>. </p>\n<p>Akka makes you avoid your sender <code>Actor</code> call the receiver <code>Actor</code> method directly. There is no direct interaction between <code>Actor</code> instances. Instead, like you saw in the previous level, <code>ActorRef</code>’s <code>!</code> method is used to communicate with other actors, and that method internally puts your messages into <code>MessageQueue</code>, before the receiver actor pick them up.  That allows you execute the sender and receiver <code>Actor</code>s work concurrently.</p>\n<p><a href="https://doc.akka.io/docs/akka/current/mailboxes.html">The documentation</a> mentions that <code>Mailbox</code>, which has the associated <code>MessageQueue</code> implementation, can be configured based on your usage. All available <code>MessageQueue</code> implementations used by Akka are chosen so that they can be accessed from different threads concurrently.</p>\n<p>When you write a concurrent application, it is generally hard to program your own class safely against access from multiple threads, especially as your class grows to be big and complicated. Instead, a lot of researchers have come up with thread-safe algorithms and implementations of data classes focusing on simple and fundamental ones. Queues are typical examples of such data classes where thread-safe implementations are available.</p>\n<p>So, Akka’s approach is to put concurrency concerns within <code>MessageQueue</code> which Akka takes care of, and provide avaialble <code>MessageQueue</code> implementations already. As long as you follow the pattern in the Akka actor model, and use immutable messages, you don’t need to worry about concurrency <strong>inside</strong> each <code>Actor</code>.</p>\n<h2>The second-lowest level: Dispatcher and ForkJoinTask</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/4n1gCDtUsDI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>Now you know that Akka <code>Actor</code>s communicate with each other via <code>MessageQueue</code>, but how does it actually use threads to execute the code inside <code>Actor</code>? Still, something needs to execute your code inside <code>Actor</code> and that’s a dedicated thread provided by the undelying <code>Dispatcher</code>.</p>\n<p>That is illustrated in the above short video, and also discussed in these two other articles.</p>\n<ul>\n<li><a href="../dispatcher-behavior/">Dispatcher behavior</a></li>\n<li><a href="../mailbox-and-fork-join-task/">Mailbox and ForkJoinTask</a></li>\n</ul>\n<p><code>Dispatcher</code>’s associated <code>ExecutorService</code> schedules a <code>ForkJointTask</code> to be run on in a pool of threads, and that <code>ForkJoinTask</code> is actually an Akka (internal) <code>Mailbox</code> as <code>Mailbox extends ForkJointTask</code>.</p>\n<p><code>Mailbox</code>’s <code>run</code> method eventually invokes the <code>receive</code> method of your <code>Actor</code>.</p>\n<h2>The lowest level: Akka application as huge ForkJoinTask application</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/572YLMHWeT4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>Taking a step further, looking at this from the <code>Executor</code>/<code>ExecutorService</code> point of view:</p>\n<ul>\n<li><a href="../executor-and-execution-context/">Executor/ExecutorService in Java, and ExecutionContext behind Future in Scala</a></li>\n</ul>\n<p>you can see your Akka application as a huge <code>ForkJoinTask</code> application, where you excecute your domain/business logic from <code>ForkJoinTask</code>’s <code>run</code> method. </p>\n<p>One caveat is that although it is <code>ForkJoinTask</code>, Akka does not use fork-join mechanism to execute the <code>Actor</code> internal code. (i.e.) Akka doesn’t use <code>fork</code>, <code>join</code> or <code>invokeAll</code> methods from <code>ForkJoinTask</code> but uses the simple <code>run</code> method, in an event style which is described in the middle of <code>ForkJoinTask</code>’s <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinTask.html">javadoc</a>.</p>\n<p><code>ForkJoinPool</code> is the default <code>ExecutorService</code> for the default <code>Dispatcher</code>. The reason why <code>ForkJoinPool</code> was chosen as default was its performance considering Akka’s use cases. More detail about the reason can be found in previous Akka’s official blog, LET IT CRASH - <a href="http://letitcrash.com/post/17607272336/scalability-of-fork-join-pool">Scalability of Fork Join Pool</a>.</p>\n<p>From here, you can even go deeper, outside of/below Akka, like how Java’s <code>ForkJoinTask</code> and <code>ForkJoinPool</code> work or even how OS schedules tasks on multiple threads. Those are out of scope of this article, but if you are interested, please go ahead! (hopefully I might cover them at some point later).</p>\n<h2>References</h2>\n<p>Javadoc of <code>java.util.concurrent.ForkJoinTask</code> at -  <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinTask.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinTask.html</a></p>\n<ul>\n<li>Official documentation of Akka Mailbox at <a href="https://doc.akka.io/docs/akka/current/mailboxes.html">https://doc.akka.io/docs/akka/current/mailboxes.html</a></li>\n<li>Official documentation of Akka Dispatcher at <a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html">https://doc.akka.io/docs/akka/2.5/dispatchers.html</a></li>\n<li>A LET IT CRASH blog post explaining efficiency of <code>ForkJoinPool</code> - <a href="http://letitcrash.com/post/17607272336/scalability-of-fork-join-pool">Scalability of Fork Join Pool</a></li>\n<li>A discussion with Doug Lea, linked from the above LET IT CRASH blog article, who lead the design and implementation of Java’s <code>ForkJoinPool</code> - <a href="http://cs.oswego.edu/pipermail/concurrency-interest/2012-January/008987.html">http://cs.oswego.edu/pipermail/concurrency-interest/2012-January/008987.html</a></li>\n</ul>',frontmatter:{title:"Akka behavior in different levels of detail",date:"February 26, 2018"}}},pathContext:{slug:"/akka-behavior-levels/"}}}});
//# sourceMappingURL=path---akka-behavior-levels-86b36b072f689335bcc9.js.map