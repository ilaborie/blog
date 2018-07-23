webpackJsonp([0xc5efa0db10bc],{417:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/executor-and-execution-context/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/executor-and-execution-context">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/zgp2B-cuUMI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<h2>Thread in Java</h2>\n<p><img src="/blog/thread-46cd166852cb3bb57e031d8bab405132.jpg" alt="thread"></p>\n<p><code class="language-text">Thread</code> and <code class="language-text">Runnable</code> has been there for long as the very first generation of concurrent execution approaches in Java. The concept and usage are rather simple, where you extend <code class="language-text">Runnable</code> and implement the <code class="language-text">run</code> method which represents the operation you want to execute concurrently.</p>\n<p>(<code class="language-text">Runnable</code> is from Java, but here I’m defining a Scala class extending it.)</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">class</span> PrintRunnable <span class="token keyword">extends</span> Runnable <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> run<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread()}] - PrintRunnable run() is executed"</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html">javadoc of <code class="language-text">Runnable</code></a></p>\n<p>Then you instantiate a <code class="language-text">Thread</code> by passing in a <code class="language-text">Runnable</code> instance, and call the <code class="language-text">start()</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala">println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread()}] - main thread"</span><span class="token punctuation">)</span>\nt <span class="token operator">=</span> <span class="token keyword">new</span> Thread<span class="token punctuation">(</span><span class="token keyword">new</span> PrintRunnable<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\nt<span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html">javadoc of <code class="language-text">Thread</code></a></p>\n<p>Then you will get output like this. The <code class="language-text">Thread</code> names are enclosed in <code class="language-text">[]</code>, which show that the main thread - (i.e.) one which did <code class="language-text">t = new Thread(new PrintRunnable(1))</code> - and the thread running <code class="language-text">Runnable</code> are different - (i.e.) Concurrently executed.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[Thread[run-main-0,5,run-main-group-0]] - main thread\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable run() is executed</code></pre>\n      </div>\n<p>Typically after you call the <code class="language-text">start()</code> method of <code class="language-text">Thread</code>, you also call the <code class="language-text">join()</code> method to wait until the thrad dies.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala">t<span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<h2>Executor and ExecutorService in Java</h2>\n<p><img src="/blog/interfaces-58c9ff9873a22582e5b84a6f127af378.jpg" alt="interfaces"></p>\n<p>The next generation of Java concurrency execution approach was <code class="language-text">Executor</code> and <code class="language-text">ExecutorService</code>.\nWhile <code class="language-text">Thread</code> allowed you handle concurrent execution in a separate thread, but when it comes to the point where you handle many threads for many different purposes in the same application, it becomes unmanagable.</p>\n<p><code class="language-text">Executor</code> and <code class="language-text">ExecutorService</code> control <code class="language-text">Thread</code> instances in the background so that you don’t handle each single <code class="language-text">Thread</code> by yourself, which is tedious, but rather you do higher level of control by handling a group of <code class="language-text">Thread</code> instances (<code class="language-text">ThreadPool</code>, which is not explained in this article though) via <code class="language-text">ExecutorService</code>.</p>\n<p>Let’s look at the code - firstly <code class="language-text">Executor</code> is a very simple interface which only has this single <code class="language-text">execute</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code class="language-java"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Executor</span> <span class="token punctuation">{</span>\n\n    <span class="token comment">/**\n     * Executes the given command at some time in the future.  The command\n     * may execute in a new thread, in a pooled thread, or in the calling\n     * thread, at the discretion of the {@code Executor} implementation.\n     *\n     * @param command the runnable task\n     * @throws RejectedExecutionException if this task cannot be\n     * accepted for execution\n     * @throws NullPointerException if command is null\n     */</span>\n    <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span>Runnable command<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html">javadoc of <code class="language-text">Executor</code></a></p>\n<p>And <code class="language-text">ExecutorService</code> is also a Java <code class="language-text">interface</code> which extends <code class="language-text">Executor</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code class="language-java"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">ExecutorService</span> <span class="token keyword">extends</span> <span class="token class-name">Executor</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>and define those lifecycle management methods (and some other methods).</p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code class="language-java">  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">void</span> <span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  List<span class="token generics function"><span class="token punctuation">&lt;</span>Runnable<span class="token punctuation">></span></span> <span class="token function">shutdownNow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">boolean</span> <span class="token function">isShutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">boolean</span> <span class="token function">isTerminated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">boolean</span> <span class="token function">awaitTermination</span><span class="token punctuation">(</span><span class="token keyword">long</span> timeout<span class="token punctuation">,</span> TimeUnit unit<span class="token punctuation">)</span>\n    <span class="token keyword">throws</span> InterruptedException<span class="token punctuation">;</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span></code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">javadoc of <code class="language-text">ExecutorService</code></a></p>\n<p>There are factory methods available in the <code class="language-text">Executors</code> class like this one, which creates a group of 5 threads in the background:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">val executor = Executors.newFixedThreadPool(5);\nexecutor.execute(new PrintRunnable)</code></pre>\n      </div>\n<p><img src="/blog/executorService-91862e98b381bb414a432b8afa9ae502.jpg" alt="executorService"></p>\n<p><img src="/blog/executorService2-41484c3a90ad5f1e855f031beb002e89.jpg" alt="executorService2"></p>\n<p>and the <code class="language-text">execute</code> call let <code class="language-text">ExecutorService</code> execute <code class="language-text">PrintRunnable</code> in the background threads.\nNote that you didn’t specify which exact thread the <code class="language-text">PrintRunnable</code> should be run in, but instead, you asked <code class="language-text">ExecutorService</code> to decide the actual thread to run it.</p>\n<h2>ExecutionContext, and how it works with Future</h2>\n<p>Now we move onto Scala’s <code class="language-text">Future</code>. Scala’s <code class="language-text">Future</code> is used with Scala’s <code class="language-text">ExecutionContext</code>, both of which I will explain below in the article.</p>\n<p>(I’m intentionally saying <strong>Scala’s</strong> <code class="language-text">Future</code> as there is also Java’s <code class="language-text">Future</code> and that is different from Scala’s. I will not talk about the Java <code class="language-text">Future</code> in this article.)</p>\n<p><img src="/blog/executionContext-be4b22319ed9bc62a679ef6265984d2d.jpg" alt="executionContext"></p>\n<p>You can think of <code class="language-text">ExecutionContext</code> in Scala is kind of equivalent to <code class="language-text">Executor</code> in Java.\nIt has the following <code class="language-text">execute</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">trait ExecutionContext {\n  def execute(runnable: Runnable): Unit\n  .. // only few other methods (two other methods as of Scala 2.12.4)\n}</code></pre>\n      </div>\n<p><img src="/blog/future-e7f56e76d0381aaa9c0f3945591632c5.jpg" alt="future"></p>\n<p>However, you don’t call the <code class="language-text">execute()</code> method of <code class="language-text">ExecutionContext</code> directly, but you should  <code class="language-text">implicit</code>ly declare <code class="language-text">ExecutionContext</code> like below.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">implicit val executionContext: ExecutionContext = \n  ExecutionContext.Implicits.global</code></pre>\n      </div>\n<p>(Little bit side-tracked, but in production code, you shouldn’t use <code class="language-text">ExecutionContext.Implicits.global</code>, as you will need more flexibility and careful configuration of the background thread pool, like number of threads, whether it’s fixed thread pool or fork-join, etc)</p>\n<p>Then you call <code class="language-text">Future{...}</code> which is <code class="language-text">Future</code> companion object’s <code class="language-text">apply</code> method, </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">def printThreadInsideFuture(): Unit = \n  println(s&quot;[${Thread.currentThread()}] - printThreadInsideFuture() is executed&quot;)\n\nval f = Future{ printThreadInsideFuture() }  </code></pre>\n      </div>\n<p>that takes an <code class="language-text">implicit</code> parameter of <code class="language-text">ExecutionContext</code>. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"> <span class="token keyword">def</span> apply<span class="token punctuation">[</span>T<span class="token punctuation">]</span><span class="token punctuation">(</span>body<span class="token operator">:</span> <span class="token keyword">=></span>T<span class="token punctuation">)</span>\n             <span class="token punctuation">(</span><span class="token keyword">implicit</span> executor<span class="token operator">:</span> ExecutionContext<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>T<span class="token punctuation">]</span></code></pre>\n      </div>\n<p>By doing this, you let the <code class="language-text">implicit</code>-ly passed <code class="language-text">ExecutionContext</code> execute the body of <code class="language-text">Future</code> you passed in, in one of the background threads.</p>\n<p><img src="/blog/onComplete-385cb92e7c1a00a9b73343a2e2150e71.jpg" alt="onComplete"></p>\n<p>Scala’s <code class="language-text">Future</code> also has <code class="language-text">onComplete</code> method which lets you execute a callback function taking the return value from the <code class="language-text">Future</code> body you earlier passed.</p>\n<p>The callback should have <code class="language-text">case Success()</code> and <code class="language-text">case Future</code> because a <code class="language-text">Future</code> can fail without completing the passed-in <code class="language-text">Future</code> body for whatever reasons.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> printThreadInsideCallback<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> \n  println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread()}] - printThreadInsideCallback() is executed"</span><span class="token punctuation">)</span>\n\n<span class="token comment">// The callback passed to onComplete is either be </span>\n<span class="token comment">// applied immediately or be scheduled asynchronously.</span>\nf1<span class="token punctuation">.</span>onComplete<span class="token punctuation">{</span>\n  <span class="token keyword">case</span> Success<span class="token punctuation">(</span>_<span class="token punctuation">)</span> <span class="token keyword">=></span> \n    printThreadInsideCallback<span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">case</span> Failure<span class="token punctuation">(</span>_<span class="token punctuation">)</span> <span class="token keyword">=></span>\n    println<span class="token punctuation">(</span><span class="token string">"Future failed!!"</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>In <a href="https://www.scala-lang.org/api/2.12.4/scala/concurrent/Future.html">Scaladoc</a>, <code class="language-text">Future</code>’s <code class="language-text">onComplete</code> has the following comment, explaining its behavior.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">When this future is completed, either through an exception, or a value,\napply the provided function.\n\nIf the future has already been completed,\nthis will either be applied immediately or be scheduled asynchronously.\n\nNote that the returned value of `f` will be discarded.</code></pre>\n      </div>\n<p>Details of <code class="language-text">onComplete</code> can be found in <a href="https://docs.scala-lang.org/overviews/core/futures.html">the official <code class="language-text">Future</code> doc</a></p>\n<h2>Inter-operabilities between Executor/ExecutorService and ExecutionContext</h2>\n<p>You might get into a situation where you have a Scala application dependent on some Java libraries, which only expects <code class="language-text">Executor</code> or <code class="language-text">ExecutionContext</code>, not knowing Scala <code class="language-text">ExecutionContext</code> at all.</p>\n<p>To deal with such a situation, Scala provides the following two traits bridging the gap between <code class="language-text">Executor</code>/<code class="language-text">ExecutorService</code> and <code class="language-text">ExecutionContext</code>. You’ll create an instance of eitehr <code class="language-text">ExecutionContextExecutor</code> or <code class="language-text">ExecutionContextExecutorService</code>, then that can be passed as <code class="language-text">Executor</code>/<code class="language-text">ExecutorService</code> to Java libraries, as well as <code class="language-text">ExecutionContext</code> to Scala libraries.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">/**\n * An ExecutionContext that is also a\n * Java Executor.\n */\ntrait ExecutionContextExecutor \n  extends ExecutionContext \n  with Executor</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token comment">/**\n * An ExecutionContext that is also a\n * Java ExecutorService.\n */</span>\n<span class="token keyword">trait</span> ExecutionContextExecutorService \n  <span class="token keyword">extends</span> ExecutionContextExecutor \n  <span class="token keyword">with</span> ExecutorService</code></pre>\n      </div>\n<p>(Indeed for example, Akka’s <code class="language-text">Dispatcher</code> extends <code class="language-text">ExecutionContextExecutor</code> so that it works as <code class="language-text">ExecutionContext</code> to run <code class="language-text">Future</code> bodies, and <code class="language-text">Executor</code> to work in Java libraries)</p>\n<h2>Instruction to run the example, and output</h2>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; git clone https://github.com/richardimaoka/resources.git\n&gt; cd resources\n&gt; cd executor-and-execution-context\n&gt; sbt</code></pre>\n      </div>\n<p>There are multiple <code class="language-text">object Main</code> defined under separate packages.\nSo, to run the thread example under the <code class="language-text">example.thread</code> package:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; runMain example.thread.Main</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] Running example.thread.Main\n[Thread[run-main-1,5,run-main-group-1]] - main thread\n[Thread[Thread-4,5,run-main-group-1]] - PrintRunnable(2) run() is executed\n[Thread[Thread-3,5,run-main-group-1]] - PrintRunnable(1) run() is executed\n[Thread[Thread-6,5,run-main-group-1]] - PrintRunnable(4) run() is executed\n[Thread[Thread-8,5,run-main-group-1]] - PrintRunnable(6) run() is executed\n[Thread[Thread-5,5,run-main-group-1]] - PrintRunnable(3) run() is executed\n[Thread[Thread-9,5,run-main-group-1]] - PrintRunnable(7) run() is executed\n[Thread[Thread-12,5,run-main-group-1]] - PrintRunnable(10) run() is executed\n[Thread[Thread-7,5,run-main-group-1]] - PrintRunnable(5) run() is executed\n[Thread[Thread-11,5,run-main-group-1]] - PrintRunnable(9) run() is executed\n[Thread[Thread-13,5,run-main-group-1]] - PrintRunnable(11) run() is executed\n[Thread[Thread-10,5,run-main-group-1]] - PrintRunnable(8) run() is executed\n[Thread[Thread-14,5,run-main-group-1]] - PrintRunnable(12) run() is executed\n[success] Total time: 1 s, completed Feb 4, 2018 5:01:20 PM</code></pre>\n      </div>\n<p>For the Executor/ExecutorService example:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; runMain example.executor.Main</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] Running example.executor.Main\n[Thread[run-main-0,5,run-main-group-0]] - main thread\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable(1) run() is executed\n[Thread[pool-8-thread-2,5,run-main-group-0]] - PrintRunnable(2) run() is executed\n[Thread[pool-8-thread-3,5,run-main-group-0]] - PrintRunnable(3) run() is executed\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable(6) run() is executed\n[Thread[pool-8-thread-4,5,run-main-group-0]] - PrintRunnable(4) run() is executed\n[Thread[pool-8-thread-2,5,run-main-group-0]] - PrintRunnable(7) run() is executed\n[Thread[pool-8-thread-3,5,run-main-group-0]] - PrintRunnable(8) run() is executed\n[Thread[pool-8-thread-5,5,run-main-group-0]] - PrintRunnable(5) run() is executed\n[Thread[pool-8-thread-2,5,run-main-group-0]] - PrintRunnable(11) run() is executed\n[Thread[pool-8-thread-4,5,run-main-group-0]] - PrintRunnable(10) run() is executed\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable(9) run() is executed\n[Thread[pool-8-thread-3,5,run-main-group-0]] - PrintRunnable(12) run() is executed\n[success] Total time: 15 s, completed Feb 4, 2018 3:26:02 PM</code></pre>\n      </div>\n<p>Then the Future example</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&gt; runMain example.future.Main</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">[info] Running example.future.Main\n[Thread[run-main-3,5,run-main-group-3]] - main thread\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(1) is executed\n[Thread[scala-execution-context-global-199,5,main]] - printThreadName(2) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(3) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(4) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(5) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(6) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(7) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(8) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(9) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(10) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(11) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(12) is executed\n[success] Total time: 3 s, completed Feb 4, 2018 4:40:30 PM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Oracle official doc for Thread at - <a href="https://docs.oracle.com/javase/tutorial/essential/concurrency/threads.html">https://docs.oracle.com/javase/tutorial/essential/concurrency/threads.html</a></li>\n<li>Javadoc of <code class="language-text">java.lang.Thraed</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html">https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html</a></li>\n<li>Javadoc of <code class="language-text">java.lang.Runnable</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html">https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html</a></li>\n<li>Javadoc of <code class="language-text">java.util.concurrent.Executor</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html</a></li>\n<li>Javadoc of <code class="language-text">java.util.concurrent.ExecutorService</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html</a></li>\n<li>Scala official documentation of <code class="language-text">Future</code> at - <a href="https://docs.scala-lang.org/overviews/core/futures.html">https://docs.scala-lang.org/overviews/core/futures.html</a></li>\n<li>Scaladoc of <code class="language-text">scala.concurrent.Future</code> at - <a href="https://www.scala-lang.org/api/2.12.4/scala/concurrent/Future.html">https://www.scala-lang.org/api/2.12.4/scala/concurrent/Future.html</a></li>\n<li>Scaladoc of <code class="language-text">scala.concurrent.Future</code> at - <a href="https://www.scala-lang.org/api/2.12.4/scala/concurrent/ExecutionContext.html">https://www.scala-lang.org/api/2.12.4/scala/concurrent/ExecutionContext.html</a></li>\n</ul>',frontmatter:{title:"Executor/ExecutorService in Java, and ExecutionContext behind Future in Scala",date:"February 07, 2018"}}},pathContext:{slug:"/executor-and-execution-context/"}}}});
//# sourceMappingURL=path---executor-and-execution-context-30e35a3234f9e1ca6776.js.map