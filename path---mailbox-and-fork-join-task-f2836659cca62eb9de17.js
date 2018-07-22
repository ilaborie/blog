webpackJsonp([0x965dc1c5592f],{420:function(a,e){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/mailbox-and-fork-join-task/index.md absPath of file >>> MarkdownRemark",html:'<h2>Update to the article and the video</h2>\n<p>Thanks to Victor who immediately noticed I had wrong assumption about <code class="language-text">ForkJoinTask</code> behavior in akka, now this article and videos were corrected.</p>\n<blockquote class="twitter-tweet" data-lang="ja"><p lang="en" dir="ltr">Only one FJT should be created.</p>&mdash; ⎷ (@viktorklang) <a href="https://twitter.com/viktorklang/status/967066161899819008?ref_src=twsrc%5Etfw">2018年2月23日</a></blockquote>\n<blockquote class="twitter-tweet" data-lang="ja"><p lang="en" dir="ltr">No worries! Actually, many years ago it did create many FJT (..or rather, Runnables).</p>&mdash; ⎷ (@viktorklang) <a href="https://twitter.com/viktorklang/status/967082002804609024?ref_src=twsrc%5Etfw">2018年2月23日</a></blockquote>\n<h2>Overview</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/dnu6JqtzNJI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>The previous <a href="../dispatcher-behavior/">Dispatcher behavior</a> article explained how <code class="language-text">Dispatcher</code> and threads are related to each other. In this article, we will go one step further in this regard.</p>\n<p>The code example is at <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">GitHub</a>, which is the same example as\nwhat’s discussed in <a href="http://localhost:8000/local-minimal-sender/">the local actor article(s)</a>.</p>\n<h2>Thread-processing details in Akka</h2>\n<p>Following the instruction at the bottom of this article, you will get output as follows <a href="https://drive.google.com/open?id=194-t1rYNQU2mprybSC9RibJ7HopCAdPqJX94XlIKxXk">(also in GoogleSpreadsheet)</a> . </p>\n<p><strong>SO MANY things in the table!! but no worries!</strong> We will go through each important piece, one after another.</p>\n<p><img src="/blog/whole-threads-066b39612b4321a93f47380f6f47c120.png" alt="whole-threads"></p>\n<h2>Caveats</h2>\n<p>You might notice that I am skipping some parts (some rows in the above table) in the article, but that is just to avoid confusion. Even with this simple example, Akka’s internal processing is very complicated. So I am only covering pieces to help you understand important stuff.</p>\n<h2>Thread[2]- sender side</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/mPmApp5B8s4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>Firstly, let’s look at “Thread[2]” from the output table. As far as what’s explained this article, Thread[2] is pretty the sender side. </p>\n<p>The sender <code class="language-text">Actor</code>’s <code class="language-text">Mailbox</code> was <code class="language-text">run()</code>, </p>\n<p><img src="/blog/thread2-a-8d985489252cb6d3290c795e05ff2f0a.png" alt="thread2-a"></p>\n<p>triggerring <a href="https://github.com/richardimaoka/resources/blob/master/local-minimal/src/main/scala/example/Main.scala#L15L20"><code class="language-text">MessageSender</code></a>’s <code class="language-text">preStart()</code> method:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">class</span> MessageSender<span class="token punctuation">(</span>messageReceiver<span class="token operator">:</span> ActorRef<span class="token punctuation">)</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">{</span>\n  <span class="token keyword">override</span> <span class="token keyword">def</span> preStart<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">val</span> messages <span class="token operator">=</span> List<span class="token punctuation">(</span>\n      <span class="token string">"Hello World"</span><span class="token punctuation">,</span>\n      <span class="token string">"Hello Universe"</span><span class="token punctuation">,</span>\n      <span class="token string">"Hello Galaxy"</span>\n    <span class="token punctuation">)</span>\n    <span class="token keyword">for</span><span class="token punctuation">(</span>msg <span class="token keyword">&lt;-</span> messages<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread().getName}]|sending message $msg to $messageReceiver"</span><span class="token punctuation">)</span>\n      messageReceiver <span class="token operator">!</span> msg\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>The very first message, <code class="language-text">&quot;Hello World&quot;</code> was <code class="language-text">dispatch</code>-ed (sent) as follows:</p>\n<p><img src="/blog/thread2-b-114a78e2ede459443c8403dbf47add14.png" alt="thread2-b"></p>\n<p>and as in the <a href="../dispatcher-behavior">previous article</a> the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L52L56"><code class="language-text">dispatch</code></a> method is implemented as below, which puts the message to the message queue of the mailbox, and …</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> dispatch<span class="token punctuation">(</span>\n  receiver<span class="token operator">:</span> ActorCell<span class="token punctuation">,</span>\n  invocation<span class="token operator">:</span> Envelope\n<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">val</span> mbox <span class="token operator">=</span> receiver<span class="token punctuation">.</span>mailbox\n  mbox<span class="token punctuation">.</span>enqueue<span class="token punctuation">(</span>receiver<span class="token punctuation">.</span><span class="token keyword">self</span><span class="token punctuation">,</span> invocation<span class="token punctuation">)</span>\n  registerForExecution<span class="token punctuation">(</span>mbox<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>… then <code class="language-text">registerForExecution</code> scheduled <code class="language-text">mbox</code> (= an instance of <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L56L57"><code class="language-text">Mailbox</code></a> which extends <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinTask.html"><code class="language-text">ForkJoinTask</code></a>) to be executed on a different thread. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">abstract</span> <span class="token keyword">class</span> Mailbox<span class="token punctuation">(</span><span class="token keyword">val</span> messageQueue<span class="token operator">:</span> MessageQueue<span class="token punctuation">)</span>\n  <span class="token keyword">extends</span> ForkJoinTask<span class="token punctuation">[</span><span class="token builtin">Unit</span><span class="token punctuation">]</span>\n  <span class="token keyword">with</span> SystemMessageQueue \n  <span class="token keyword">with</span> Runnable <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Same as the first message, the second ard thrid messages, <code class="language-text">&quot;Hellow Universe&quot;</code> and <code class="language-text">&quot;Hello Galaxy&quot;</code> were <code class="language-text">dispatch</code>-ed as well. </p>\n<p><img src="/blog/thread2-c-99271c77c10ff7f19b21c01ad4dae08a.png" alt="thread2-c"></p>\n<p>Since the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L115"><code class="language-text">registerForExecution(mbox, ...)</code></a> is called for the same <code class="language-text">Mailbox</code> instance, <code class="language-text">mbox</code>, the underlying <code class="language-text">executorService</code> scheduled the same <code class="language-text">Mailbox</code> (<code class="language-text">ForkJoinTask</code>).</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">def registerForExecution(mbox: Mailbox, ...): Boolean = {\n  ...\n  executorService execute mbox\n  ...\n}</code></pre>\n      </div>\n<p>About the general behavior when you <code class="language-text">execute</code> the same <code class="language-text">ForkJoinTask</code> instance in <code class="language-text">ForkJoinPool</code>, see my below tweet (not every single <code class="language-text">ForkJoinTask</code> is really run):</p>\n<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Ah I see this is how ForkJoinPool&#39;s execute method behaves differently when different Runnable instances are executed, and when the same Runnable instance is executed multiple times. <a href="https://t.co/OhuHMUyszU">pic.twitter.com/OhuHMUyszU</a></p>&mdash; Richard Imaoka (@richardimaoka) <a href="https://twitter.com/richardimaoka/status/967260911785226245?ref_src=twsrc%5Etfw">2018/2/23</a></blockquote>\n<h2>Thread[4]- receiver side</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/91naDxLuveY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>Let’s move onto the “Thread[4]”, the receiver side behavior. The point here (and for the whole article) is that <code class="language-text">processMailbox()</code> is a <strong>recursive method</strong>.</p>\n<p>The scheduled <code class="language-text">ForkJoinTask</code> triggered the <code class="language-text">run</code> method. Remenber <code class="language-text">Mailbox extends ForkJoinTask</code>, so <code class="language-text">Mailbox</code> overrides the <code class="language-text">run</code> method.</p>\n<p><img src="/blog/thread4-a-9e49aae18351df1e05777b6435f0512a.png" alt="thread4-a"></p>\n<p>It’s also discussed in the <a href="../dispatcher-behavior">previous article</a>, but <code class="language-text">processMailbox</code> method executs the <a href="(https://github.com/richardimaoka/resources/blob/master/local-minimal/src/main/scala/example/Main.scala#L8L11)"><code class="language-text">receive</code> method</a> of the <code class="language-text">Actor</code></p>\n<p><img src="/blog/thread4-b-6d1b838c9c19c60825f7c99260c0d880.png" alt="thread4-b"></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">class</span> MessageReceiver <span class="token keyword">extends</span> Actor <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> s<span class="token operator">:</span> <span class="token builtin">String</span> <span class="token keyword">=></span>\n      println<span class="token punctuation">(</span>s<span class="token string">"${Thread.currentThread()} [${self.path}]|EchoActor: received message = $s"</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Next, you see <code class="language-text">processMailbox()</code> was called multiple times before you see <code class="language-text">Mailbox run() finished</code>.\n<img src="/blog/thread4-c-361a5920b601649cced526ed2f99c923.png" alt="thread4-c"></p>\n<p>because <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L250"><code class="language-text">processMailbox</code> method</a> is actually recursive:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token annotation punctuation">@tailrec</span> <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">def</span> processMailbox<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token comment">// def dequeue(): Envelope = messageQueue.dequeue()</span>\n  <span class="token keyword">val</span> next <span class="token operator">=</span> dequeue<span class="token punctuation">(</span><span class="token punctuation">)</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  actor invoke next\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  processMailbox<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>so it processed all the three messages, <code class="language-text">&quot;Hello World&quot;</code>, <code class="language-text">&quot;Hello Universe&quot;</code> and <code class="language-text">&quot;Hello Galaxy&quot;</code> in the single call of <code class="language-text">ForkJoinTask</code>’s <code class="language-text">run</code>.</p>\n<p><img src="/blog/thread4-d-277e3712f0d47a8446f144afc35b9a44.png" alt="thread4-d"></p>\n<p>How many messages can be processed by a single <code class="language-text">ForkJoinTask</code> is controlled by the <code class="language-text">throughput</code> setting in <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/resources/reference.conf#L513">config</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text"># Throughput defines the number of messages that are processed in a batch\n# before the thread is returned to the pool. Set to 1 for as fair as possible.\nthroughput = 5</code></pre>\n      </div>\n<h2>Instruction to run the example, and output</h2>\n<p>We can use <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">the same example code</a> as the ”<a href="../local-minimal-sender">Local Actor workflow part 1 - Sender side</a>” article.code, however, because you need a bit of tweaking which I am going to explain below.</p>\n<p>Clone the akka repository,</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; git clone https://github.com/akka/akka.git\n&gt; cd akka</code></pre>\n      </div>\n<p>and insert <code class="language-text">println</code> calls <a href="https://github.com/richardimaoka/akka/commit/6b19cabf3d9895fd8cc925b760f6b9ec21a1eaef">like this</a>) in akka to see the <code class="language-text">Mailbox</code> and <code class="language-text">Dispatcher</code> behavior. Then execute <code class="language-text">publishLocal</code>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; sbt\n&gt; project akka-actor\n&gt; publishLocal</code></pre>\n      </div>\n<p>now you will see <code class="language-text">akka-actor_2.12;2.5-SNAPSHOT</code> is built and stored under your <code class="language-text">.ivy</code> directory.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] :: delivering :: com.typesafe.akka#akka-actor_2.12;2.5-SNAPSHOT :: 2.5-SNAPSHOT :: integration :: Thu Feb 22 07:22:33 JST 2018\n[info] delivering ivy file to Users/username/akka/akka-actor/target/ivy-2.5-SNAPSHOT.xml\n[info]  published akka-actor_2.12 to Users/username/.ivy2/local/com.typesafe.akka/akka-actor_2.12/2.5-SNAPSHOT/poms/akka-actor_2.12.pom\n[info]  published akka-actor_2.12 to Users/username/.ivy2/local/com.typesafe.akka/akka-actor_2.12/2.5-SNAPSHOT/jars/akka-actor_2.12.jar\n[info]  published akka-actor_2.12 to Users/username/.ivy2/local/com.typesafe.akka/akka-actor_2.12/2.5-SNAPSHOT/srcs/akka-actor_2.12-sources.jar\n[info]  published akka-actor_2.12 to Users/username/.ivy2/local/com.typesafe.akka/akka-actor_2.12/2.5-SNAPSHOT/docs/akka-actor_2.12-javadoc.jar\n[info]  published ivy to Users/username/.ivy2/local/com.typesafe.akka/akka-actor_2.12/2.5-SNAPSHOT/ivys/ivy.xml</code></pre>\n      </div>\n<p>From here you move to the <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">local actor example code</a>. </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; cd ~\n// or `cd` to whatever directory you like\n\n&gt; git clone https://github.com/richardimaoka/resources.git\n&gt; cd resources\n&gt; cd local-minimal</code></pre>\n      </div>\n<p>Make <a href="https://github.com/richardimaoka/resources/commit/15e140cb110e8ca37934eb150da94fea49e3431c">this change</a> to the local example code, to use the 2.5-SNAPSHOT version of <code class="language-text">akka-actor</code> jar built by the above step.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">//build.sbt\n libraryDependencies ++= Seq(\n-  &quot;com.typesafe.akka&quot; %% &quot;akka-actor&quot; % &quot;2.5.9&quot;,\n+  &quot;com.typesafe.akka&quot; %% &quot;akka-actor&quot; % &quot;2.5-SNAPSHOT&quot;,\n   scalaTest % Test\n )</code></pre>\n      </div>\n<p>From inside the <code class="language-text">local-minimal</code> directory, you can do:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; sbt\n&gt; runMain example.Main</code></pre>\n      </div>\n<p>and you will output like the following (order of messages could be little differnt due to concurrency). </p>\n<p>After I did some clean-up, I posted the result <a href="https://drive.google.com/open?id=194-t1rYNQU2mprybSC9RibJ7HopCAdPqJX94XlIKxXk">here in Google Spreadsheet</a>. (Shortened the thread name, exclude <a href="https://doc.akka.io/docs/akka/2.5/general/supervision.html#user-the-guardian-actor">user guardian</a> from logs, shortened the actor path, etc)</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">Thread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox run() called\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox processMailbox() next=null\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|sending message Hello World to Actor[akka://exampleSystem/user/receiver#1486562265]\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Dispatcher dispatch(Envelope(Hello World,Actor[akka://exampleSystem/user/sender#-1400752577])) started\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox run() called\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Dispatcher dispatch(Envelope(Hello World,Actor[akka://exampleSystem/user/sender#-1400752577])) finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() called, shouldProcessMessage=true\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|sending message Hello Universe to Actor[akka://exampleSystem/user/receiver#1486562265]\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() next=Envelope(Hello World,Actor[akka://exampleSystem/user/sender#-1400752577])\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Dispatcher dispatch(Envelope(Hello Universe,Actor[akka://exampleSystem/user/sender#-1400752577])) started\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|EchoActor: received message = Hello World\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Dispatcher dispatch(Envelope(Hello Universe,Actor[akka://exampleSystem/user/sender#-1400752577])) finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() called, shouldProcessMessage=true\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|sending message Hello Galaxy to Actor[akka://exampleSystem/user/receiver#1486562265]\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() next=Envelope(Hello Universe,Actor[akka://exampleSystem/user/sender#-1400752577])\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Dispatcher dispatch(Envelope(Hello Galaxy,Actor[akka://exampleSystem/user/sender#-1400752577])) started\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|EchoActor: received message = Hello Universe\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Dispatcher dispatch(Envelope(Hello Galaxy,Actor[akka://exampleSystem/user/sender#-1400752577])) finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() called, shouldProcessMessage=true\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox processMailbox() called, shouldProcessMessage=true\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() next=Envelope(Hello Galaxy,Actor[akka://exampleSystem/user/sender#-1400752577])\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox processMailbox() next=null\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|EchoActor: received message = Hello Galaxy\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() called, shouldProcessMessage=true\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() next=null\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox run() called\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox run() called\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox run() called\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox processMailbox() called, shouldProcessMessage=false\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox processMailbox() called, shouldProcessMessage=false\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user/sender]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() called, shouldProcessMessage=false\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox processMailbox() finished\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox run() called\nThread[exampleSystem-akka.actor.default-dispatcher-4,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-2,5,run-main-group-8]|[akka://exampleSystem/user/receiver]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox run() finished\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox processMailbox() called, shouldProcessMessage=false\nThread[exampleSystem-akka.actor.default-dispatcher-3,5,run-main-group-8]|[akka://exampleSystem/user]|Mailbox processMailbox() finished</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka Mailbox at <a href="https://doc.akka.io/docs/akka/current/mailboxes.html">https://doc.akka.io/docs/akka/current/mailboxes.html</a></li>\n<li>Official documentation of Akka Dispatcher at <a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html">https://doc.akka.io/docs/akka/2.5/dispatchers.html</a>\nOracle’s official fork-join tutorial - <a href="https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html">https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html</a>\nOracle’s official fork-join article - <a href="http://www.oracle.com/technetwork/articles/java/fork-join-422606.html">http://www.oracle.com/technetwork/articles/java/fork-join-422606.html</a>\nForkJoinTask javadoc - <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinTask.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinTask.html</a>\nForkJoinPool javadoc - <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html</a></li>\n</ul>',frontmatter:{title:"Mailbox and ForkJoinTask",date:"February 24, 2018"}}},pathContext:{slug:"/mailbox-and-fork-join-task/"}}}});
//# sourceMappingURL=path---mailbox-and-fork-join-task-f2836659cca62eb9de17.js.map