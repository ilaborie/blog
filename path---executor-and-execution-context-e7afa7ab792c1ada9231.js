webpackJsonp([0xc5efa0db10bc],{507:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/executor-and-execution-context/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/executor-and-execution-context">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/zgp2B-cuUMI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<h2>Thread in Java</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/thread-46cd166852cb3bb57e031d8bab405132-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAQDBf/EABYBAQEBAAAAAAAAAAAAAAAAAAEDBP/aAAwDAQACEAMQAAAB6ChmhioL/8QAFxABAQEBAAAAAAAAAAAAAAAAAQARIf/aAAgBAQABBQLuuxshIQX/xAAWEQADAAAAAAAAAAAAAAAAAAAAARP/2gAIAQMBAT8BiiKP/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAISE//aAAgBAgEBPwHRy3P/xAAWEAEBAQAAAAAAAAAAAAAAAABBACD/2gAIAQEABj8CZz//xAAbEAABBAMAAAAAAAAAAAAAAAAAAREhMVFxkf/aAAgBAQABPyFcnRRLNkVqOiEIsf/aAAwDAQACAAMAAAAQvC//xAAYEQACAwAAAAAAAAAAAAAAAAAAAREhMf/aAAgBAwEBPxCqBIWn/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAFx/9oACAECAQE/EMUX/8QAGxABAAIDAQEAAAAAAAAAAAAAAQARITFBkaH/2gAIAQEAAT8Qz7rvkItMblmW57+rFNp9YhwdcWB0+z//2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="thread"\n        title=""\n        src="/static/thread-46cd166852cb3bb57e031d8bab405132-f8fb9.jpg"\n        srcset="/static/thread-46cd166852cb3bb57e031d8bab405132-e8976.jpg 148w,\n/static/thread-46cd166852cb3bb57e031d8bab405132-63df2.jpg 295w,\n/static/thread-46cd166852cb3bb57e031d8bab405132-f8fb9.jpg 590w,\n/static/thread-46cd166852cb3bb57e031d8bab405132-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><code>Thread</code> and <code>Runnable</code> has been there for long as the very first generation of concurrent execution approaches in Java. The concept and usage are rather simple, where you extend <code>Runnable</code> and implement the <code>run</code> method which represents the operation you want to execute concurrently.</p>\n<p>(<code>Runnable</code> is from Java, but here I’m defining a Scala class extending it.)</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> PrintRunnable <span class="token keyword">extends</span> Runnable <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> run<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread()}] - PrintRunnable run() is executed"</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html">javadoc of <code>Runnable</code></a></p>\n<p>Then you instantiate a <code>Thread</code> by passing in a <code>Runnable</code> instance, and call the <code>start()</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread()}] - main thread"</span><span class="token punctuation">)</span>\nt <span class="token operator">=</span> <span class="token keyword">new</span> Thread<span class="token punctuation">(</span><span class="token keyword">new</span> PrintRunnable<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\nt<span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html">javadoc of <code>Thread</code></a></p>\n<p>Then you will get output like this. The <code>Thread</code> names are enclosed in <code>[]</code>, which show that the main thread - (i.e.) one which did <code>t = new Thread(new PrintRunnable(1))</code> - and the thread running <code>Runnable</code> are different - (i.e.) Concurrently executed.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[Thread[run-main-0,5,run-main-group-0]] - main thread\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable run() is executed</code></pre>\n      </div>\n<p>Typically after you call the <code>start()</code> method of <code>Thread</code>, you also call the <code>join()</code> method to wait until the thrad dies.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>t<span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h2>Executor and ExecutorService in Java</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/interfaces-58c9ff9873a22582e5b84a6f127af378-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAIBBf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAe7WiVD/xAAVEAEBAAAAAAAAAAAAAAAAAAAgIf/aAAgBAQABBQKr/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAwEBPwE//8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPwE//8QAFBABAAAAAAAAAAAAAAAAAAAAIP/aAAgBAQAGPwJf/8QAGxAAAgEFAAAAAAAAAAAAAAAAAAERICExQXH/2gAIAQEAAT8h7Q8WFO6P/9oADAMBAAIAAwAAABCAD//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QP//EABsQAAICAwEAAAAAAAAAAAAAAAERACEgMUFx/9oACAEBAAE/EE1q8hkF1K92+BYf/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="interfaces"\n        title=""\n        src="/static/interfaces-58c9ff9873a22582e5b84a6f127af378-f8fb9.jpg"\n        srcset="/static/interfaces-58c9ff9873a22582e5b84a6f127af378-e8976.jpg 148w,\n/static/interfaces-58c9ff9873a22582e5b84a6f127af378-63df2.jpg 295w,\n/static/interfaces-58c9ff9873a22582e5b84a6f127af378-f8fb9.jpg 590w,\n/static/interfaces-58c9ff9873a22582e5b84a6f127af378-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>The next generation of Java concurrency execution approach was <code>Executor</code> and <code>ExecutorService</code>.\nWhile <code>Thread</code> allowed you handle concurrent execution in a separate thread, but when it comes to the point where you handle many threads for many different purposes in the same application, it becomes unmanagable.</p>\n<p><code>Executor</code> and <code>ExecutorService</code> control <code>Thread</code> instances in the background so that you don’t handle each single <code>Thread</code> by yourself, which is tedious, but rather you do higher level of control by handling a group of <code>Thread</code> instances (<code>ThreadPool</code>, which is not explained in this article though) via <code>ExecutorService</code>.</p>\n<p>Let’s look at the code - firstly <code>Executor</code> is a very simple interface which only has this single <code>execute</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Executor</span> <span class="token punctuation">{</span>\n\n    <span class="token comment">/**\n     * Executes the given command at some time in the future.  The command\n     * may execute in a new thread, in a pooled thread, or in the calling\n     * thread, at the discretion of the {@code Executor} implementation.\n     *\n     * @param command the runnable task\n     * @throws RejectedExecutionException if this task cannot be\n     * accepted for execution\n     * @throws NullPointerException if command is null\n     */</span>\n    <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span>Runnable command<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html">javadoc of <code>Executor</code></a></p>\n<p>And <code>ExecutorService</code> is also a Java <code>interface</code> which extends <code>Executor</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">ExecutorService</span> <span class="token keyword">extends</span> <span class="token class-name">Executor</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>and define those lifecycle management methods (and some other methods).</p>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code>  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">void</span> <span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  List<span class="token operator">&lt;</span>Runnable<span class="token operator">></span> <span class="token function">shutdownNow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">boolean</span> <span class="token function">isShutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">boolean</span> <span class="token function">isTerminated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">boolean</span> <span class="token function">awaitTermination</span><span class="token punctuation">(</span><span class="token keyword">long</span> timeout<span class="token punctuation">,</span> TimeUnit unit<span class="token punctuation">)</span>\n    <span class="token keyword">throws</span> InterruptedException<span class="token punctuation">;</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n</code></pre>\n      </div>\n<p><a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">javadoc of <code>ExecutorService</code></a></p>\n<p>There are factory methods available in the <code>Executors</code> class like this one, which creates a group of 5 threads in the background:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>val executor = Executors.newFixedThreadPool(5);\nexecutor.execute(new PrintRunnable)</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/executorService-91862e98b381bb414a432b8afa9ae502-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMBBf/EABYBAQEBAAAAAAAAAAAAAAAAAAADBP/aAAwDAQACEAMQAAAB6S+54wXH/8QAGRAAAwEBAQAAAAAAAAAAAAAAAAERIQIS/9oACAEBAAEFAtvN9aTUkRH/xAAWEQADAAAAAAAAAAAAAAAAAAAAARP/2gAIAQMBAT8BkiKP/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAISE//aAAgBAgEBPwHRy3P/xAAYEAACAwAAAAAAAAAAAAAAAAAAMQEgQf/aAAgBAQAGPwLSGOn/xAAbEAACAQUAAAAAAAAAAAAAAAAAATEhQVFh8P/aAAgBAQABPyHmyZF1U5EpSaNR/9oADAMBAAIAAwAAABBc7//EABgRAAIDAAAAAAAAAAAAAAAAAAABIVFh/9oACAEDAQE/EJk6ND//xAAWEQEBAQAAAAAAAAAAAAAAAAABEBH/2gAIAQIBAT8QEQcl/8QAGxABAAIDAQEAAAAAAAAAAAAAAQARIUFRMWH/2gAIAQEAAT8QG0FNvzHnKXm2GfS2gbU3btiGDZ5lgC9PWf/Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="executorService"\n        title=""\n        src="/static/executorService-91862e98b381bb414a432b8afa9ae502-f8fb9.jpg"\n        srcset="/static/executorService-91862e98b381bb414a432b8afa9ae502-e8976.jpg 148w,\n/static/executorService-91862e98b381bb414a432b8afa9ae502-63df2.jpg 295w,\n/static/executorService-91862e98b381bb414a432b8afa9ae502-f8fb9.jpg 590w,\n/static/executorService-91862e98b381bb414a432b8afa9ae502-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/executorService2-41484c3a90ad5f1e855f031beb002e89-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEDBf/EABYBAQEBAAAAAAAAAAAAAAAAAAMAAf/aAAwDAQACEAMQAAAB0nZgMC5l/8QAGhAAAwADAQAAAAAAAAAAAAAAAAERAhIhQf/aAAgBAQABBQL3G7dIqkiI/8QAFhEAAwAAAAAAAAAAAAAAAAAAAAET/9oACAEDAQE/AZIij//EABYRAAMAAAAAAAAAAAAAAAAAAAACEv/aAAgBAgEBPwG3Lc//xAAYEAACAwAAAAAAAAAAAAAAAAAAASAxQf/aAAgBAQAGPwLRFw//xAAcEAACAgIDAAAAAAAAAAAAAAAAASFBEZExUWH/2gAIAQEAAT8hm+5cPZaXPYipNYR5H//aAAwDAQACAAMAAAAQlO//xAAYEQACAwAAAAAAAAAAAAAAAAAAASFRYf/aAAgBAwEBPxCZOjQ//8QAFREBAQAAAAAAAAAAAAAAAAAAARD/2gAIAQIBAT8QGQZf/8QAGxABAAIDAQEAAAAAAAAAAAAAAQARITFRQWH/2gAIAQEAAT8QG7Zb8xu2m83Bn0vUBanb6xzorWWAL09Z/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="executorService2"\n        title=""\n        src="/static/executorService2-41484c3a90ad5f1e855f031beb002e89-f8fb9.jpg"\n        srcset="/static/executorService2-41484c3a90ad5f1e855f031beb002e89-e8976.jpg 148w,\n/static/executorService2-41484c3a90ad5f1e855f031beb002e89-63df2.jpg 295w,\n/static/executorService2-41484c3a90ad5f1e855f031beb002e89-f8fb9.jpg 590w,\n/static/executorService2-41484c3a90ad5f1e855f031beb002e89-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>and the <code>execute</code> call let <code>ExecutorService</code> execute <code>PrintRunnable</code> in the background threads.\nNote that you didn’t specify which exact thread the <code>PrintRunnable</code> should be run in, but instead, you asked <code>ExecutorService</code> to decide the actual thread to run it.</p>\n<h2>ExecutionContext, and how it works with Future</h2>\n<p>Now we move onto Scala’s <code>Future</code>. Scala’s <code>Future</code> is used with Scala’s <code>ExecutionContext</code>, both of which I will explain below in the article.</p>\n<p>(I’m intentionally saying <strong>Scala’s</strong> <code>Future</code> as there is also Java’s <code>Future</code> and that is different from Scala’s. I will not talk about the Java <code>Future</code> in this article.)</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/executionContext-be4b22319ed9bc62a679ef6265984d2d-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAe61CqP/xAAXEAEAAwAAAAAAAAAAAAAAAAAQABFB/9oACAEBAAEFAppR/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAwEBPwE//8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPwE//8QAFBABAAAAAAAAAAAAAAAAAAAAIP/aAAgBAQAGPwJf/8QAGRABAAMBAQAAAAAAAAAAAAAAARARQQBh/9oACAEBAAE/IRMvhXxNDI//2gAMAwEAAgADAAAAEPMP/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAwEBPxA//8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPxA//8QAGhABAQEAAwEAAAAAAAAAAAAAAREAECFRYf/aAAgBAQABPxA1j6uURvjV8cgkezCqAeP/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="executionContext"\n        title=""\n        src="/static/executionContext-be4b22319ed9bc62a679ef6265984d2d-f8fb9.jpg"\n        srcset="/static/executionContext-be4b22319ed9bc62a679ef6265984d2d-e8976.jpg 148w,\n/static/executionContext-be4b22319ed9bc62a679ef6265984d2d-63df2.jpg 295w,\n/static/executionContext-be4b22319ed9bc62a679ef6265984d2d-f8fb9.jpg 590w,\n/static/executionContext-be4b22319ed9bc62a679ef6265984d2d-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>You can think of <code>ExecutionContext</code> in Scala is kind of equivalent to <code>Executor</code> in Java.\nIt has the following <code>execute</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>trait ExecutionContext {\n  def execute(runnable: Runnable): Unit\n  .. // only few other methods (two other methods as of Scala 2.12.4)\n}</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/future-e7f56e76d0381aaa9c0f3945591632c5-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EABYBAQEBAAAAAAAAAAAAAAAAAAIDBP/aAAwDAQACEAMQAAAB0Hq2eKFRr//EABgQAQADAQAAAAAAAAAAAAAAAAABESFB/9oACAEBAAEFAta7UKhT/8QAFREBAQAAAAAAAAAAAAAAAAAAABP/2gAIAQMBAT8Bim//xAAWEQADAAAAAAAAAAAAAAAAAAAAAhL/2gAIAQIBAT8BtymP/8QAFxAAAwEAAAAAAAAAAAAAAAAAARAgcf/aAAgBAQAGPwJHY//EABoQAAIDAQEAAAAAAAAAAAAAAAABESExQXH/2gAIAQEAAT8hd3ZpW+F6MOYuwhL9P//aAAwDAQACAAMAAAAQsA//xAAWEQADAAAAAAAAAAAAAAAAAAAAEVH/2gAIAQMBAT8QSiU//8QAFREBAQAAAAAAAAAAAAAAAAAAARD/2gAIAQIBAT8QJX//xAAcEAEAAgMAAwAAAAAAAAAAAAABABEhMUFRcZH/2gAIAQEAAT8QZqe3rBVlx5sPfFZjm0/Wbm2OsylbS5n/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="future"\n        title=""\n        src="/static/future-e7f56e76d0381aaa9c0f3945591632c5-f8fb9.jpg"\n        srcset="/static/future-e7f56e76d0381aaa9c0f3945591632c5-e8976.jpg 148w,\n/static/future-e7f56e76d0381aaa9c0f3945591632c5-63df2.jpg 295w,\n/static/future-e7f56e76d0381aaa9c0f3945591632c5-f8fb9.jpg 590w,\n/static/future-e7f56e76d0381aaa9c0f3945591632c5-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>However, you don’t call the <code>execute()</code> method of <code>ExecutionContext</code> directly, but you should  <code>implicit</code>ly declare <code>ExecutionContext</code> like below.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>implicit val executionContext: ExecutionContext = \n  ExecutionContext.Implicits.global</code></pre>\n      </div>\n<p>(Little bit side-tracked, but in production code, you shouldn’t use <code>ExecutionContext.Implicits.global</code>, as you will need more flexibility and careful configuration of the background thread pool, like number of threads, whether it’s fixed thread pool or fork-join, etc)</p>\n<p>Then you call <code>Future{...}</code> which is <code>Future</code> companion object’s <code>apply</code> method, </p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>def printThreadInsideFuture(): Unit = \n  println(s"[${Thread.currentThread()}] - printThreadInsideFuture() is executed")\n\nval f = Future{ printThreadInsideFuture() }  </code></pre>\n      </div>\n<p>that takes an <code>implicit</code> parameter of <code>ExecutionContext</code>. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code> <span class="token keyword">def</span> apply<span class="token punctuation">[</span>T<span class="token punctuation">]</span><span class="token punctuation">(</span>body<span class="token operator">:</span> <span class="token keyword">=></span>T<span class="token punctuation">)</span>\n             <span class="token punctuation">(</span><span class="token keyword">implicit</span> executor<span class="token operator">:</span> ExecutionContext<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>T<span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<p>By doing this, you let the <code>implicit</code>-ly passed <code>ExecutionContext</code> execute the body of <code>Future</code> you passed in, in one of the background threads.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/onComplete-385cb92e7c1a00a9b73343a2e2150e71-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EABYBAQEBAAAAAAAAAAAAAAAAAAIDBP/aAAwDAQACEAMQAAAB0Hq2eKFRr//EABgQAAMBAQAAAAAAAAAAAAAAAAABESFB/9oACAEBAAEFAtp2IiIf/8QAFREBAQAAAAAAAAAAAAAAAAAAABP/2gAIAQMBAT8Bim//xAAWEQADAAAAAAAAAAAAAAAAAAAAAhL/2gAIAQIBAT8BtymP/8QAGBAAAgMAAAAAAAAAAAAAAAAAAAEgMXH/2gAIAQEABj8CLHsP/8QAGxAAAwACAwAAAAAAAAAAAAAAAAERIUExYXH/2gAIAQEAAT8hbplldWWtmeRh2Ooiv0//2gAMAwEAAgADAAAAELAP/8QAFhEAAwAAAAAAAAAAAAAAAAAAABFR/9oACAEDAQE/EEolP//EABURAQEAAAAAAAAAAAAAAAAAAAEQ/9oACAECAQE/ECV//8QAHBABAAIDAAMAAAAAAAAAAAAAAQARITFBYXGR/9oACAEBAAE/EBAbfMIpHvisxzafrFkvSuvJlK2lzP/Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="onComplete"\n        title=""\n        src="/static/onComplete-385cb92e7c1a00a9b73343a2e2150e71-f8fb9.jpg"\n        srcset="/static/onComplete-385cb92e7c1a00a9b73343a2e2150e71-e8976.jpg 148w,\n/static/onComplete-385cb92e7c1a00a9b73343a2e2150e71-63df2.jpg 295w,\n/static/onComplete-385cb92e7c1a00a9b73343a2e2150e71-f8fb9.jpg 590w,\n/static/onComplete-385cb92e7c1a00a9b73343a2e2150e71-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Scala’s <code>Future</code> also has <code>onComplete</code> method which lets you execute a callback function taking the return value from the <code>Future</code> body you earlier passed.</p>\n<p>The callback should have <code>case Success()</code> and <code>case Future</code> because a <code>Future</code> can fail without completing the passed-in <code>Future</code> body for whatever reasons.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> printThreadInsideCallback<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> \n  println<span class="token punctuation">(</span>s<span class="token string">"[${Thread.currentThread()}] - printThreadInsideCallback() is executed"</span><span class="token punctuation">)</span>\n\n<span class="token comment">// The callback passed to onComplete is either be </span>\n<span class="token comment">// applied immediately or be scheduled asynchronously.</span>\nf1<span class="token punctuation">.</span>onComplete<span class="token punctuation">{</span>\n  <span class="token keyword">case</span> Success<span class="token punctuation">(</span>_<span class="token punctuation">)</span> <span class="token keyword">=></span> \n    printThreadInsideCallback<span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">case</span> Failure<span class="token punctuation">(</span>_<span class="token punctuation">)</span> <span class="token keyword">=></span>\n    println<span class="token punctuation">(</span><span class="token string">"Future failed!!"</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>In <a href="https://www.scala-lang.org/api/2.12.4/scala/concurrent/Future.html">Scaladoc</a>, <code>Future</code>’s <code>onComplete</code> has the following comment, explaining its behavior.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>When this future is completed, either through an exception, or a value,\napply the provided function.\n\nIf the future has already been completed,\nthis will either be applied immediately or be scheduled asynchronously.\n\nNote that the returned value of `f` will be discarded.</code></pre>\n      </div>\n<p>Details of <code>onComplete</code> can be found in <a href="https://docs.scala-lang.org/overviews/core/futures.html">the official <code>Future</code> doc</a></p>\n<h2>Inter-operabilities between Executor/ExecutorService and ExecutionContext</h2>\n<p>You might get into a situation where you have a Scala application dependent on some Java libraries, which only expects <code>Executor</code> or <code>ExecutionContext</code>, not knowing Scala <code>ExecutionContext</code> at all.</p>\n<p>To deal with such a situation, Scala provides the following two traits bridging the gap between <code>Executor</code>/<code>ExecutorService</code> and <code>ExecutionContext</code>. You’ll create an instance of eitehr <code>ExecutionContextExecutor</code> or <code>ExecutionContextExecutorService</code>, then that can be passed as <code>Executor</code>/<code>ExecutorService</code> to Java libraries, as well as <code>ExecutionContext</code> to Scala libraries.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>/**\n * An ExecutionContext that is also a\n * Java Executor.\n */\ntrait ExecutionContextExecutor \n  extends ExecutionContext \n  with Executor</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token comment">/**\n * An ExecutionContext that is also a\n * Java ExecutorService.\n */</span>\n<span class="token keyword">trait</span> ExecutionContextExecutorService \n  <span class="token keyword">extends</span> ExecutionContextExecutor \n  <span class="token keyword">with</span> ExecutorService\n</code></pre>\n      </div>\n<p>(Indeed for example, Akka’s <code>Dispatcher</code> extends <code>ExecutionContextExecutor</code> so that it works as <code>ExecutionContext</code> to run <code>Future</code> bodies, and <code>Executor</code> to work in Java libraries)</p>\n<h2>Instruction to run the example, and output</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd executor-and-execution-context\n> sbt</code></pre>\n      </div>\n<p>There are multiple <code>object Main</code> defined under separate packages.\nSo, to run the thread example under the <code>example.thread</code> package:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.thread.Main</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.thread.Main\n[Thread[run-main-1,5,run-main-group-1]] - main thread\n[Thread[Thread-4,5,run-main-group-1]] - PrintRunnable(2) run() is executed\n[Thread[Thread-3,5,run-main-group-1]] - PrintRunnable(1) run() is executed\n[Thread[Thread-6,5,run-main-group-1]] - PrintRunnable(4) run() is executed\n[Thread[Thread-8,5,run-main-group-1]] - PrintRunnable(6) run() is executed\n[Thread[Thread-5,5,run-main-group-1]] - PrintRunnable(3) run() is executed\n[Thread[Thread-9,5,run-main-group-1]] - PrintRunnable(7) run() is executed\n[Thread[Thread-12,5,run-main-group-1]] - PrintRunnable(10) run() is executed\n[Thread[Thread-7,5,run-main-group-1]] - PrintRunnable(5) run() is executed\n[Thread[Thread-11,5,run-main-group-1]] - PrintRunnable(9) run() is executed\n[Thread[Thread-13,5,run-main-group-1]] - PrintRunnable(11) run() is executed\n[Thread[Thread-10,5,run-main-group-1]] - PrintRunnable(8) run() is executed\n[Thread[Thread-14,5,run-main-group-1]] - PrintRunnable(12) run() is executed\n[success] Total time: 1 s, completed Feb 4, 2018 5:01:20 PM</code></pre>\n      </div>\n<p>For the Executor/ExecutorService example:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.executor.Main</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.executor.Main\n[Thread[run-main-0,5,run-main-group-0]] - main thread\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable(1) run() is executed\n[Thread[pool-8-thread-2,5,run-main-group-0]] - PrintRunnable(2) run() is executed\n[Thread[pool-8-thread-3,5,run-main-group-0]] - PrintRunnable(3) run() is executed\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable(6) run() is executed\n[Thread[pool-8-thread-4,5,run-main-group-0]] - PrintRunnable(4) run() is executed\n[Thread[pool-8-thread-2,5,run-main-group-0]] - PrintRunnable(7) run() is executed\n[Thread[pool-8-thread-3,5,run-main-group-0]] - PrintRunnable(8) run() is executed\n[Thread[pool-8-thread-5,5,run-main-group-0]] - PrintRunnable(5) run() is executed\n[Thread[pool-8-thread-2,5,run-main-group-0]] - PrintRunnable(11) run() is executed\n[Thread[pool-8-thread-4,5,run-main-group-0]] - PrintRunnable(10) run() is executed\n[Thread[pool-8-thread-1,5,run-main-group-0]] - PrintRunnable(9) run() is executed\n[Thread[pool-8-thread-3,5,run-main-group-0]] - PrintRunnable(12) run() is executed\n[success] Total time: 15 s, completed Feb 4, 2018 3:26:02 PM</code></pre>\n      </div>\n<p>Then the Future example</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.future.Main</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.future.Main\n[Thread[run-main-3,5,run-main-group-3]] - main thread\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(1) is executed\n[Thread[scala-execution-context-global-199,5,main]] - printThreadName(2) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(3) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(4) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(5) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(6) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(7) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(8) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(9) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(10) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(11) is executed\n[Thread[scala-execution-context-global-200,5,main]] - printThreadName(12) is executed\n[success] Total time: 3 s, completed Feb 4, 2018 4:40:30 PM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Oracle official doc for Thread at - <a href="https://docs.oracle.com/javase/tutorial/essential/concurrency/threads.html">https://docs.oracle.com/javase/tutorial/essential/concurrency/threads.html</a></li>\n<li>Javadoc of <code>java.lang.Thraed</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html">https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html</a></li>\n<li>Javadoc of <code>java.lang.Runnable</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html">https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html</a></li>\n<li>Javadoc of <code>java.util.concurrent.Executor</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html</a></li>\n<li>Javadoc of <code>java.util.concurrent.ExecutorService</code> at - <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html</a></li>\n<li>Scala official documentation of <code>Future</code> at - <a href="https://docs.scala-lang.org/overviews/core/futures.html">https://docs.scala-lang.org/overviews/core/futures.html</a></li>\n<li>Scaladoc of <code>scala.concurrent.Future</code> at - <a href="https://www.scala-lang.org/api/2.12.4/scala/concurrent/Future.html">https://www.scala-lang.org/api/2.12.4/scala/concurrent/Future.html</a></li>\n<li>Scaladoc of <code>scala.concurrent.Future</code> at - <a href="https://www.scala-lang.org/api/2.12.4/scala/concurrent/ExecutionContext.html">https://www.scala-lang.org/api/2.12.4/scala/concurrent/ExecutionContext.html</a></li>\n</ul>',
frontmatter:{title:"Executor/ExecutorService in Java, and ExecutionContext behind Future in Scala",date:"February 07, 2018"}}},pathContext:{slug:"/executor-and-execution-context/"}}}});
//# sourceMappingURL=path---executor-and-execution-context-e7afa7ab792c1ada9231.js.map