webpackJsonp([36029449993048],{522:function(a,s){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/richardimaoka/blog/src/pages/local-minimal-sender/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/hQJkN4zXTyo" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>This is about how Akka sends a message from one Actor to another <strong>locally</strong> (i.e. within the same JVM). As in the <a href="https://doc.akka.io/docs/akka/2.5/serialization.html?language=scala"><code>Serialization</code> part</a> of the official doc:</p>\n<blockquote>\n<p>The messages that Akka actors send to each other are JVM objects (e.g. instances of Scala case classes). Message passing between actors that live on the same JVM is straightforward. It is simply done via reference passing. </p>\n</blockquote>\n<p>If you are interested in the remote behavior when sending messages to remote JVM, I will write remote versions of articles soon so please refer to them.</p>\n<h2>Workflow</h2>\n<p><a href="https://github.com/richardimaoka/resources/blob/master/local-minimal/src/main/scala/example/Main.scala#L14L24"><code>MessageSender</code></a> sends messages “Hello World”, “Hello Universe” and “Hello Galaxy” to the <code>messageReceiver</code> actor.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> MessageSender<span class="token punctuation">(</span>messageReceiver<span class="token operator">:</span> ActorRef<span class="token punctuation">)</span>\n  <span class="token keyword">extends</span> Actor <span class="token punctuation">{</span>\n  \n  <span class="token keyword">override</span> <span class="token keyword">def</span> preStart<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">val</span> messages <span class="token operator">=</span> List<span class="token punctuation">(</span>\n      <span class="token string">"Hello World"</span><span class="token punctuation">,</span>\n      <span class="token string">"Hello Universe"</span><span class="token punctuation">,</span>\n      <span class="token string">"Hello Galaxy"</span>\n    <span class="token punctuation">)</span>\n\n    <span class="token keyword">for</span><span class="token punctuation">(</span>msg <span class="token keyword">&lt;-</span> messages<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      messageReceiver <span class="token operator">!</span> msg\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>The <code>preStart</code> method is a <a href="https://doc.akka.io/docs/akka/2.5/guide/tutorial_1.html?language=scala#the-actor-lifecycle">lifecycle method</a> provided by Akka Actor.</p>\n<p>The below is what’s inside the main method, which initializes the receiver and the sender.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">val</span> system <span class="token operator">=</span> ActorSystem<span class="token punctuation">(</span><span class="token string">"exampleSystem"</span><span class="token punctuation">)</span>\n\n<span class="token keyword">val</span> receiver <span class="token operator">=</span> system<span class="token punctuation">.</span>actorOf<span class="token punctuation">(</span>\n  Props<span class="token punctuation">[</span>MessageReceiver<span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token string">"receiver"</span>\n<span class="token punctuation">)</span>\n\n<span class="token comment">// sender</span>\nsystem<span class="token punctuation">.</span>actorOf<span class="token punctuation">(</span>\n  MessageSender<span class="token punctuation">.</span>props<span class="token punctuation">(</span>receiver<span class="token punctuation">)</span><span class="token punctuation">,</span> \n  <span class="token string">"sender"</span>\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>As in the <code>preStart</code> method of <code>MessageSender</code>, the first message to be sent is,</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code>messageReceiver <span class="token operator">!</span> <span class="token string">"Hello World"</span><span class="token punctuation">,</span>\n</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/message-4093dc1854d0d519ddf1fc745d96b789-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMCBAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB12zLEFgP/8QAGhABAAEFAAAAAAAAAAAAAAAAAgEDEBITMf/aAAgBAQABBQIy9i5Tyk3/AP/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAgBAwEBPwHEf//EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAgBAgEBPwHVf//EABkQAAIDAQAAAAAAAAAAAAAAAAABESIxIP/aAAgBAQAGPwJyqjjS28f/xAAZEAACAwEAAAAAAAAAAAAAAAABEQAQIWH/2gAIAQEAAT8hNHyQjlaZDdFNSr//2gAMAwEAAgADAAAAEGsP/8QAFhEBAQEAAAAAAAAAAAAAAAAAEQEA/9oACAEDAQE/EIIOgg7/xAAWEQEBAQAAAAAAAAAAAAAAAAABEQD/2gAIAQIBAT8QQtmVbN//xAAeEAEAAgIBBQAAAAAAAAAAAAABABEhYRAxQXGBkf/aAAgBAQABPxBggLs3Ws94fHKRuXB2AtRTxEHrfplN/eP/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="message"\n        title=""\n        src="/blog/static/message-4093dc1854d0d519ddf1fc745d96b789-f8fb9.jpg"\n        srcset="/blog/static/message-4093dc1854d0d519ddf1fc745d96b789-e8976.jpg 148w,\n/blog/static/message-4093dc1854d0d519ddf1fc745d96b789-63df2.jpg 295w,\n/blog/static/message-4093dc1854d0d519ddf1fc745d96b789-f8fb9.jpg 590w,\n/blog/static/message-4093dc1854d0d519ddf1fc745d96b789-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>where the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorRef.scala#L400"><code>!</code> method</a> is a method of <code>LocalActorRef</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">override</span> <span class="token keyword">def</span> <span class="token operator">!</span><span class="token punctuation">(</span>message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">)</span>\n  <span class="token punctuation">(</span><span class="token keyword">implicit</span> sender<span class="token operator">:</span> ActorRef <span class="token operator">=</span> Actor<span class="token punctuation">.</span>noSender<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span>\n    actorCell<span class="token punctuation">.</span>sendMessage<span class="token punctuation">(</span>message<span class="token punctuation">,</span> sender<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>Above <code>actorCell</code> is an instance of <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L370"><code>ActorCell</code></a>, which implements <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L220"><code>Cell</code> trait</a>, and the <code>Cell</code> trait has the following <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L290L291"><code>sendMessage</code></a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">final</span> <span class="token keyword">def</span> sendMessage<span class="token punctuation">(</span>\n  message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">,</span> \n  sender<span class="token operator">:</span> ActorRef\n<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span>\n  sendMessage<span class="token punctuation">(</span>Envelope<span class="token punctuation">(</span>message<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> system<span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>Here you see an <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/AbstractDispatcher.scala#L23"><code>Envelope</code></a> which encapsulates <code>message</code> and <code>sender</code></p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/envelope-91cfa7f809e99172f6902691b880c231-85b28.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 298px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 40.939597315436245%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAIABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIF/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB2rCgf//EABYQAAMAAAAAAAAAAAAAAAAAAAECEP/aAAgBAQABBQItf//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABcQAAMBAAAAAAAAAAAAAAAAAAEQMZH/2gAIAQEABj8Chx//xAAYEAEAAwEAAAAAAAAAAAAAAAABABFx4f/aAAgBAQABPyFLQ0gGuzZ//9oADAMBAAIAAwAAABDzz//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QP//EABsQAQEAAgMBAAAAAAAAAAAAAAERACExUWHx/9oACAEBAAE/ENQGJCnGF26IfGFmgPjc/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="envelope"\n        title=""\n        src="/blog/static/envelope-91cfa7f809e99172f6902691b880c231-85b28.jpg"\n        srcset="/blog/static/envelope-91cfa7f809e99172f6902691b880c231-83678.jpg 148w,\n/blog/static/envelope-91cfa7f809e99172f6902691b880c231-04048.jpg 295w,\n/blog/static/envelope-91cfa7f809e99172f6902691b880c231-85b28.jpg 298w"\n        sizes="(max-width: 298px) 100vw, 298px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">case</span> <span class="token keyword">class</span> Envelope<span class="token punctuation">(</span>\n  <span class="token keyword">val</span> message<span class="token operator">:</span> <span class="token builtin">Any</span><span class="token punctuation">,</span> \n  <span class="token keyword">val</span> sender<span class="token operator">:</span> ActorRef\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>To illustrate the workflow so far up to the <code>sendMessage</code>:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/sendMessage-97c0ac69e59e5122c722926a1e80a4e4-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMCBAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB24uEQWCv/8QAGxAAAQQDAAAAAAAAAAAAAAAAAQACAxIQESH/2gAIAQEAAQUC6tmsdi3P/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQMBAT8BR//EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oACAECAQE/AVf/xAAYEAACAwAAAAAAAAAAAAAAAAAAASAiUf/aAAgBAQAGPwIelof/xAAaEAADAQADAAAAAAAAAAAAAAAAAREhEDFh/9oACAEBAAE/IW9wfX5Wej2rHSUnH//aAAwDAQACAAMAAAAQ7w//xAAXEQEBAQEAAAAAAAAAAAAAAAARAAEh/9oACAEDAQE/EDlgwb//xAAXEQEBAQEAAAAAAAAAAAAAAAARAAEh/9oACAECAQE/EHradS//xAAeEAACAQMFAAAAAAAAAAAAAAABEQAQITFBYXGBkf/aAAgBAQABPxBlSWLSxNIGzRwbSZIJHEIZPoxN/af/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="sendMessage"\n        title=""\n        src="/blog/static/sendMessage-97c0ac69e59e5122c722926a1e80a4e4-f8fb9.jpg"\n        srcset="/blog/static/sendMessage-97c0ac69e59e5122c722926a1e80a4e4-e8976.jpg 148w,\n/blog/static/sendMessage-97c0ac69e59e5122c722926a1e80a4e4-63df2.jpg 295w,\n/blog/static/sendMessage-97c0ac69e59e5122c722926a1e80a4e4-f8fb9.jpg 590w,\n/blog/static/sendMessage-97c0ac69e59e5122c722926a1e80a4e4-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>The <code>sendMessage</code> method of the <code>Cell</code> trait (<code>ActorCell</code>) calls the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/dungeon/Dispatch.scala#L136"><code>sendMessage</code> method</a> of the <code>Dispatch</code> trait.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> sendMessage<span class="token punctuation">(</span>msg<span class="token operator">:</span> Envelope<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span>\n  <span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n    dispatcher<span class="token punctuation">.</span>dispatch<span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> \n</code></pre>\n      </div>\n<p>(<a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html?language=scala">The concept of <code>Dispatcher</code></a> might be unfamiliar to you and it is probably difficult to understand. I will write another article later to illustrate <code>Dispatcher</code> in more detail, but for now, you can assume dispatcher is, as the meaning of the word says, “sender” of messages.)</p>\n<p>There are two distinct <code>Dispatch</code> and <code>Dispatcher</code> traits in akka. The <code>Dispatch</code> trait has a reference to <code>dispatch: Dispatcher</code> and <code>Dispatcher</code>’s <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L52L56">dispatch</a> method is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> dispatch<span class="token punctuation">(</span>\n  receiver<span class="token operator">:</span> ActorCell<span class="token punctuation">,</span>\n  invocation<span class="token operator">:</span> Envelope\n<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">val</span> mbox <span class="token operator">=</span> receiver<span class="token punctuation">.</span>mailbox\n  mbox<span class="token punctuation">.</span>enqueue<span class="token punctuation">(</span>receiver<span class="token punctuation">.</span><span class="token keyword">self</span><span class="token punctuation">,</span> invocation<span class="token punctuation">)</span>\n  registerForExecution<span class="token punctuation">(</span>mbox<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/dispatcher-ed3db186b54b5f43bbc7ddf384206e5e-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAIDBAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB3VcISwWf/8QAGxAAAgEFAAAAAAAAAAAAAAAAARECAAMQEiH/2gAIAQEAAQUCJpuFvYxXVj//xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAgBAwEBPwFH/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQIBAT8BV//EABkQAAIDAQAAAAAAAAAAAAAAAAAhASAiMf/aAAgBAQAGPwITk12n/8QAGhAAAwADAQAAAAAAAAAAAAAAAAERECExQf/aAAgBAQABPyGS10trI9qyiNvRIuLH/9oADAMBAAIAAwAAABAzD//EABcRAQEBAQAAAAAAAAAAAAAAAAERACH/2gAIAQMBAT8QemEJd//EABcRAQEBAQAAAAAAAAAAAAAAAAERACH/2gAIAQIBAT8QOOVbN//EABwQAQEAAgIDAAAAAAAAAAAAAAERACExQRBhcf/aAAgBAQABPxC4INNvGMTiITtMsHQFUU+Yoo4Sji1AfXfj/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="dispatcher"\n        title=""\n        src="/blog/static/dispatcher-ed3db186b54b5f43bbc7ddf384206e5e-f8fb9.jpg"\n        srcset="/blog/static/dispatcher-ed3db186b54b5f43bbc7ddf384206e5e-e8976.jpg 148w,\n/blog/static/dispatcher-ed3db186b54b5f43bbc7ddf384206e5e-63df2.jpg 295w,\n/blog/static/dispatcher-ed3db186b54b5f43bbc7ddf384206e5e-f8fb9.jpg 590w,\n/blog/static/dispatcher-ed3db186b54b5f43bbc7ddf384206e5e-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L85"><code>Mailbox</code></a> has the following <code>enqueue</code> method</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> enqueue<span class="token punctuation">(</span>receiver<span class="token operator">:</span> ActorRef<span class="token punctuation">,</span> msg<span class="token operator">:</span> Envelope<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> messageQueue<span class="token punctuation">.</span>enqueue<span class="token punctuation">(</span>receiver<span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/enqueue-9a6b0df6f94bee8c851810e8e5a0d95a-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAECAwQF/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAe4nIpNBZ//EABoQAAICAwAAAAAAAAAAAAAAAAERAAIDEBL/2gAIAQEAAQUCJjdMfRqBFr//xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAgBAwEBPwFH/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQIBAT8BV//EABkQAAIDAQAAAAAAAAAAAAAAAAAhASAiMf/aAAgBAQAGPwITk12n/8QAGRABAQEBAQEAAAAAAAAAAAAAAREAIRAx/9oACAEBAAE/IUnEutXR2mVj64B8PP/aAAwDAQACAAMAAAAQEw//xAAXEQEBAQEAAAAAAAAAAAAAAAABEQAh/9oACAEDAQE/EHphCXf/xAAXEQEBAQEAAAAAAAAAAAAAAAABEQAh/9oACAECAQE/EDjlWzf/xAAbEAEBAQACAwAAAAAAAAAAAAABEQAQQTFhcf/aAAgBAQABPxASAQJTMTiITtNYOgKop8wUBvi1uWoD674//9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="enqueue"\n        title=""\n        src="/blog/static/enqueue-9a6b0df6f94bee8c851810e8e5a0d95a-f8fb9.jpg"\n        srcset="/blog/static/enqueue-9a6b0df6f94bee8c851810e8e5a0d95a-e8976.jpg 148w,\n/blog/static/enqueue-9a6b0df6f94bee8c851810e8e5a0d95a-63df2.jpg 295w,\n/blog/static/enqueue-9a6b0df6f94bee8c851810e8e5a0d95a-f8fb9.jpg 590w,\n/blog/static/enqueue-9a6b0df6f94bee8c851810e8e5a0d95a-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>The <code>messageQueue</code> is type of <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L614L618"><code>MessageQueue</code></a> class which is defined for <a href="https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes">each different <code>Mailbox</code> type</a>. The one for the default <code>UnboundedMailbox</code> is:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">object</span> UnboundedMailbox <span class="token punctuation">{</span>\n  <span class="token keyword">class</span> MessageQueue \n    <span class="token keyword">extends</span> ConcurrentLinkedQueue<span class="token punctuation">[</span>Envelope<span class="token punctuation">]</span> \n    <span class="token keyword">with</span> UnboundedQueueBasedMessageQueue <span class="token punctuation">{</span>\n      <span class="token keyword">final</span> <span class="token keyword">def</span> queue<span class="token operator">:</span> Queue<span class="token punctuation">[</span>Envelope<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Coming back to the <code>dispatch</code> method of <code>Dispatcher</code>, it has <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L115">registerForExecution</a> as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> registerForExecution<span class="token punctuation">(</span>mbox<span class="token operator">:</span> Mailbox<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Boolean</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  executorService execute mbox\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Since <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L56L57"><code>Mailbox</code></a> is defined as <code>ForkJoinTask</code>, the execution (i.e. processing) of <code>Mailbox</code> is run on a different <code>Thread</code>, which will be covered in <a href="../local-minimal-receiver">the next article</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">abstract</span> <span class="token keyword">class</span> Mailbox<span class="token punctuation">(</span><span class="token keyword">val</span> messageQueue<span class="token operator">:</span> MessageQueue<span class="token punctuation">)</span>\n  <span class="token keyword">extends</span> ForkJoinTask<span class="token punctuation">[</span><span class="token builtin">Unit</span><span class="token punctuation">]</span> \n  <span class="token keyword">with</span> SystemMessageQueue \n  <span class="token keyword">with</span> Runnable <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>In the next article, <a href="../local-minimal-receiver">Local Actor workflow part 2 - Receiver side</a>, I will discuss about what happens on the receiver side which is triggered as the above <code>ForkJoinTask</code>.</p>\n<h2>Instruction to run the example</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd local-minimal\n> sbt\n> runMain example.Main</code></pre>\n      </div>\n<h2>Output</h2>\n<p>Some <code>println</code> calls are inserted in the <a href="https://github.com/richardimaoka/resources/tree/master/local-minimal">complete example at GitHub</a> to illustrate the behavior.</p>\n<p>Thread names are shown as [exampleSystem-akka.actor.default-dispatcher-3] and […-4].</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.Main\nprovider = local\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello World to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello Universe to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello World\n[exampleSystem-akka.actor.default-dispatcher-5] sending message Hello Galaxy to Actor[akka://exampleSystem/user/receiver#-846959521]\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello Universe\n[exampleSystem-akka.actor.default-dispatcher-2] EchoActor: received message = Hello Galaxy\n[success] Total time: 7 s, completed Jan 30, 2018 6:16:46 AM</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation of Akka Actor at <a href="https://doc.akka.io/docs/akka/2.5/actors.html">https://doc.akka.io/docs/akka/2.5/actors.html</a></li>\n<li>Official documentation of Akka Dispatcher at <a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html">https://doc.akka.io/docs/akka/2.5/dispatchers.html</a></li>\n<li>Official documentation of Akka lifecycle at <a href="https://doc.akka.io/docs/akka/current/actors.html$actor-lifecycle">https://doc.akka.io/docs/akka/current/actors.html$actor-lifecycle</a></li>\n<li>Official documentation of Akka Mailbox at <a href="https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes">https://doc.akka.io/docs/akka/2.5/mailboxes.html?language=scala#mailboxes</a>)</li>\n<li>Official documentation of Akka location transparency at <a href="https://doc.akka.io/docs/akka/current/general/remoting.html#location-transparency">https://doc.akka.io/docs/akka/current/general/remoting.html#location-transparency</a></li>\n<li>Oracle’s documentation about Fork/Join at <a href="https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html">https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html</a></li>\n<li>ExecutorService Javadoc at <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html">https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html</a></li>\n</ul>',frontmatter:{title:"Local Actor workflow part 1 - Sender side",date:"January 29, 2018"}}},pathContext:{slug:"/local-minimal-sender/"}}}});
//# sourceMappingURL=path---local-minimal-sender-d60d1b4a0a4b5f61449f.js.map