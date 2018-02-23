webpackJsonp([0xd69bb118bf8e],{509:function(A,a){A.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/blog/src/pages/dispatcher-behavior/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/hnIDDXDD1Io" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p>The concept of Akka <a href="https://doc.akka.io/docs/akka/2.5/dispatchers.html?language=scala"><code>Dispatcher</code></a> might be unfamiliar to you and it is probably difficult to understand. So I am going to explain how Dispatcher works in detail here.</p>\n<h2>Meaning of “dispatch”</h2>\n<p>If you look up the meaning of the word “dispatch” in a dictionary, you would find it is almost same as “send”. In akka, <code>Dispatcher</code> is, yes, what sends messages, but something more than that.</p>\n<h2>Dispatcher and Actor relationship</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/dispatcher-config-71bb79f013295f371bbb154394bc0b8e-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAECBf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAdhqxsYn/8QAGhAAAgIDAAAAAAAAAAAAAAAAAAEDIQIRMv/aAAgBAQABBQKShWIneoseT//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABcQAAMBAAAAAAAAAAAAAAAAAAABEBH/2gAIAQEABj8C2tin/8QAHBABAAICAwEAAAAAAAAAAAAAAQARMUEhYZGx/9oACAEBAAE/IUnfqKhXkwiDZK+zkrDc/9oADAMBAAIAAwAAABDbD//EABURAQEAAAAAAAAAAAAAAAAAAAEQ/9oACAEDAQE/EBJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPxA//8QAHBABAQACAgMAAAAAAAAAAAAAAREAITHBQWFx/9oACAEBAAE/EH4oDgzyHeVQ2nJrftmKmkTSYyM0GWaYDZFBa+sAICb6z//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="dispatcher-config"\n        title=""\n        src="/blog/static/dispatcher-config-71bb79f013295f371bbb154394bc0b8e-f8fb9.jpg"\n        srcset="/blog/static/dispatcher-config-71bb79f013295f371bbb154394bc0b8e-e8976.jpg 148w,\n/blog/static/dispatcher-config-71bb79f013295f371bbb154394bc0b8e-63df2.jpg 295w,\n/blog/static/dispatcher-config-71bb79f013295f371bbb154394bc0b8e-f8fb9.jpg 590w,\n/blog/static/dispatcher-config-71bb79f013295f371bbb154394bc0b8e-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Firstly, <code>Dispatcher</code> is configured for <code>ActorSystem</code>, typically in <code>application.conf</code>. There is at least default one, and you can <a href="https://doc.akka.io/docs/akka/current/dispatchers.html#dispatchers">also configure multiple <code>Dispatcher</code>s</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">val</span> system <span class="token operator">=</span> ActorSystem<span class="token punctuation">(</span><span class="token string">"exampleSystem"</span><span class="token punctuation">)</span>\nsystem<span class="token punctuation">.</span>dispatchers<span class="token punctuation">.</span>lookup<span class="token punctuation">(</span><span class="token string">"my-dispatcher"</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>As a rule of thumb, the <code>Dispatcher</code> instance for the given name is created when the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatchers.scala#L79"><code>lookup</code> method of <code>ActorSystem</code></a> is called for the first time. You don’t normally call it yourself, but this lookup is done by akka. Another thing is the default <code>Dispatcher</code> is already created upon <code>ActorSystem</code> initialization, as it calls <code>lookup</code> for the default internally.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token comment">/**\n* Returns a dispatcher as specified in configuration. Please note that this\n* method _may_ create and return a NEW dispatcher, _every_ call.\n*\n* Throws ConfigurationException if the specified dispatcher cannot be found in the configuration.\n*/</span>\n<span class="token keyword">def</span> lookup<span class="token punctuation">(</span>id<span class="token operator">:</span> <span class="token builtin">String</span><span class="token punctuation">)</span><span class="token operator">:</span> MessageDispatcher <span class="token operator">=</span> lookupConfigurator<span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">.</span>dispatcher<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/dispatcher-actor-7b6a80fb086b1889109bdb71e0f6f72f-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEDAgX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB7Nc0RDF//8QAGRAAAQUAAAAAAAAAAAAAAAAAEAABESEy/9oACAEBAAEFArUBtD//xAAVEQEBAAAAAAAAAAAAAAAAAAABEP/aAAgBAwEBPwEn/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPwE//8QAGBAAAgMAAAAAAAAAAAAAAAAAARACMWH/2gAIAQEABj8ConHJ/wD/xAAbEAACAgMBAAAAAAAAAAAAAAABERAxACGBsf/aAAgBAQABPyGpLj0ywAqXY80//9oADAMBAAIAAwAAABCPD//EABURAQEAAAAAAAAAAAAAAAAAABAx/9oACAEDAQE/EIP/xAAWEQADAAAAAAAAAAAAAAAAAAABEDH/2gAIAQIBAT8QNX//xAAbEAEAAgIDAAAAAAAAAAAAAAABABFBYRAhgf/aAAgBAQABPxBQdJWBVeG4gKlXZhAoom161z//2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="dispatcher-actor"\n        title=""\n        src="/blog/static/dispatcher-actor-7b6a80fb086b1889109bdb71e0f6f72f-f8fb9.jpg"\n        srcset="/blog/static/dispatcher-actor-7b6a80fb086b1889109bdb71e0f6f72f-e8976.jpg 148w,\n/blog/static/dispatcher-actor-7b6a80fb086b1889109bdb71e0f6f72f-63df2.jpg 295w,\n/blog/static/dispatcher-actor-7b6a80fb086b1889109bdb71e0f6f72f-f8fb9.jpg 590w,\n/blog/static/dispatcher-actor-7b6a80fb086b1889109bdb71e0f6f72f-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><code>Dispatcher</code> is NOT part of <code>Actor</code>. One <code>Dispatcher</code> can send messages to multiple <code>Actor</code>s. (NOTE: <code>Dispatcher</code> doesn’t have routing capabilities. Routing is done by akka <a href="https://doc.akka.io/docs/akka/2.5/routing.html#routing"><code>Router</code></a>)</p>\n<h2>Dispatcher and ExecutorService</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/dispatcher-executor-service-35308dce71584aa4d7cdfad5c6d455dd-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMBAgX/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHdUwC5Iv8A/8QAGhAAAgIDAAAAAAAAAAAAAAAAAQIAEAMRMf/aAAgBAQABBQIzHs03Fr//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAYEAACAwAAAAAAAAAAAAAAAAAAAREgIv/aAAgBAQAGPwI0or//xAAbEAEAAgIDAAAAAAAAAAAAAAABABARIUFx4f/aAAgBAQABPyFgZYjdjv2jmOVf/9oADAMBAAIAAwAAABDvD//EABYRAAMAAAAAAAAAAAAAAAAAABARIf/aAAgBAwEBPxCsf//EABYRAAMAAAAAAAAAAAAAAAAAABARIf/aAAgBAgEBPxCsf//EABwQAQEAAgIDAAAAAAAAAAAAAAERABAhQVFxsf/aAAgBAQABPxC2E6IzF1gkDo+lohpecIMnj5r/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="dispatcher-executor-service"\n        title=""\n        src="/blog/static/dispatcher-executor-service-35308dce71584aa4d7cdfad5c6d455dd-f8fb9.jpg"\n        srcset="/blog/static/dispatcher-executor-service-35308dce71584aa4d7cdfad5c6d455dd-e8976.jpg 148w,\n/blog/static/dispatcher-executor-service-35308dce71584aa4d7cdfad5c6d455dd-63df2.jpg 295w,\n/blog/static/dispatcher-executor-service-35308dce71584aa4d7cdfad5c6d455dd-f8fb9.jpg 590w,\n/blog/static/dispatcher-executor-service-35308dce71584aa4d7cdfad5c6d455dd-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><code>Dispatcher</code> has <code>ExecutorService</code>. <code>ExecutorService</code> is like a pool of threads where you can execute code (<code>Runnable</code>) concurrently. See <a href="../executor-and-execution-context">Executor/ExecutorService in Java, and ExecutionContext behind Future in Scala</a> for illustration and more details.</p>\n<p>Here is <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L47"><code>executorService</code> method</a> of <code>Dispatcher</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> executorService<span class="token operator">:</span> ExecutorServiceDelegate <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n</code></pre>\n      </div>\n<p>The pool of threads from <code>ExecutorService</code> is what invokes <code>Actor</code>’s <code>receive</code> method, which will be explained later in this article.</p>\n<h2>Dispatcher and sender-side behavior</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/actor-cell-reference-6638f57fa06f7a2f08d0bd841a7eb514-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAIBBAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB20sBAon/xAAZEAACAwEAAAAAAAAAAAAAAAABEQACEiD/2gAIAQEAAQUCRddHhCf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAZEAACAwEAAAAAAAAAAAAAAAAAAREgIjH/2gAIAQEABj8CZpRTh//EAB0QAAECBwAAAAAAAAAAAAAAAAABIRARMUFR0eH/2gAIAQEAAT8hRzdLG9uk0zF6g//aAAwDAQACAAMAAAAQgP8A/8QAFhEBAQEAAAAAAAAAAAAAAAAAACEB/9oACAEDAQE/EMiv/8QAFREBAQAAAAAAAAAAAAAAAAAAACH/2gAIAQIBAT8QR//EABwQAQACAgMBAAAAAAAAAAAAAAERIQAxEEFhkf/aAAgBAQABPxC6WWZvmsL2RehfxZHUKrfK6VFZWM//2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="actor-cell-reference"\n        title=""\n        src="/blog/static/actor-cell-reference-6638f57fa06f7a2f08d0bd841a7eb514-f8fb9.jpg"\n        srcset="/blog/static/actor-cell-reference-6638f57fa06f7a2f08d0bd841a7eb514-e8976.jpg 148w,\n/blog/static/actor-cell-reference-6638f57fa06f7a2f08d0bd841a7eb514-63df2.jpg 295w,\n/blog/static/actor-cell-reference-6638f57fa06f7a2f08d0bd841a7eb514-f8fb9.jpg 590w,\n/blog/static/actor-cell-reference-6638f57fa06f7a2f08d0bd841a7eb514-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Part of below is reharsing what was already discussed in <a href="../local-minimal-sender">Local Actor workflow part 1 - Sender side</a>, but here more from the <code>Dispatcher</code> perspective. </p>\n<p>(For remoting, there are several more steps to go through but it is combination of local message-passing and network via Netty, as discussed in <a href="../remote-minimal-sender">remoting articles</a>)</p>\n<p><code>LocalActorRef</code> is <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorRef.scala#L319">coupled with <code>ActorCell</code></a>, which is hidden from users as private and it is implementation details of how akka messaging works.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> LocalActorRef<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n <span class="token keyword">extends</span> ActorRefWithCell\n <span class="token keyword">with</span> LocalRef  <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">val</span> actorCell<span class="token operator">:</span> ActorCell <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p><a href="">As you see below</a>, <code>ActorCell</code> has a reference to <code>Dispatcher</code> (<code>val dispatcher: MessageDispatcher</code>).</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> ActorCell<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">val</span> dispatcher<span class="token operator">:</span>  MessageDispatcher<span class="token punctuation">,</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token punctuation">)</span> <span class="token keyword">extends</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">with</span> dungeon<span class="token punctuation">.</span>Dispatch <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>So when you do <code>actorRef ! "hello"</code>, that <code>actorRef</code> (whose type is <code>LocalActorRef</code>) already knows what <code>Dispatcher</code> to use via <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/ActorCell.scala#L370"><code>ActorCell</code></a>.</p>\n<p>Also <code>ActorCell</code> extends <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/actor/dungeon/Dispatch.scala#L27"><code>Dispatch</code> trait</a> and it has a refence to <code>Mailbox</code>, so <code>LocalActorRef</code> also knows which <code>Mailbox</code> to send the massage, via <code>ActorCell</code>. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">trait</span> Dispatch <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token operator">:</span> ActorCell ⇒\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token keyword">def</span> mailbox<span class="token operator">:</span> Mailbox <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>This couping of <code>LocalActorRef</code>, <code>ActorCell</code>, and <code>Mailbox</code> is what I meant by <code>Dispatcher</code> doesn’t have routing capabilities in a “NOTE” earlier.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/sender-82d6c008ac87adf2e72a0389eab07010-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAECBAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB2o2EIQn/xAAZEAACAwEAAAAAAAAAAAAAAAABEQACEhD/2gAIAQEAAQUCDddGMdyJ/8QAFREBAQAAAAAAAAAAAAAAAAAAACH/2gAIAQMBAT8BV//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABkQAAIDAQAAAAAAAAAAAAAAAAABESAiMf/aAAgBAQAGPwJmlFOH/8QAGhAAAgIDAAAAAAAAAAAAAAAAAREAQRDB8P/aAAgBAQABPyFzWqc7XcFBGQOk/9oADAMBAAIAAwAAABATL//EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oACAEDAQE/EEP/xAAVEQEBAAAAAAAAAAAAAAAAAAAAIf/aAAgBAgEBPxBH/8QAHBABAAICAwEAAAAAAAAAAAAAARExACEQUZFx/9oACAEBAAE/EAsXOak1XzDO6TQ34sQbQdPCSI04FB5Z/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="sender"\n        title=""\n        src="/blog/static/sender-82d6c008ac87adf2e72a0389eab07010-f8fb9.jpg"\n        srcset="/blog/static/sender-82d6c008ac87adf2e72a0389eab07010-e8976.jpg 148w,\n/blog/static/sender-82d6c008ac87adf2e72a0389eab07010-63df2.jpg 295w,\n/blog/static/sender-82d6c008ac87adf2e72a0389eab07010-f8fb9.jpg 590w,\n/blog/static/sender-82d6c008ac87adf2e72a0389eab07010-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><code>Dispatcher</code>’s <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L52L56">dispatch</a> method is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> dispatch<span class="token punctuation">(</span>\n  receiver<span class="token operator">:</span> ActorCell<span class="token punctuation">,</span>\n  invocation<span class="token operator">:</span> Envelope\n<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">val</span> mbox <span class="token operator">=</span> receiver<span class="token punctuation">.</span>mailbox\n  mbox<span class="token punctuation">.</span>enqueue<span class="token punctuation">(</span>receiver<span class="token punctuation">.</span><span class="token keyword">self</span><span class="token punctuation">,</span> invocation<span class="token punctuation">)</span>\n  registerForExecution<span class="token punctuation">(</span>mbox<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>where <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Dispatcher.scala#L115">registerForExecution</a> is:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">def</span> registerForExecution<span class="token punctuation">(</span>mbox<span class="token operator">:</span> Mailbox<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Boolean</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  executorService execute mbox\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>In the above code, <code>Dispatcher</code>’s <code>excutorService</code> is executing <code>mbox: Mailbox</code>, because <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L56L57"><code>Mailbox</code></a> is defined as <code>ForkJoinTask</code>, which can be <code>execute</code>-d by <code>ExecutorService</code>.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/fork-join-1-4e5b8282e2b15dfd37966268ebb6b7c4-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAe3u0A//xAAXEAEAAwAAAAAAAAAAAAAAAAABESAh/9oACAEBAAEFAjWK/wD/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAUEAEAAAAAAAAAAAAAAAAAAAAg/9oACAEBAAY/Al//xAAYEAEBAQEBAAAAAAAAAAAAAAARARAAMf/aAAgBAQABPyGnYSecMIpHf//aAAwDAQACAAMAAAAQwA//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/ED//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/ED//xAAcEAEAAgEFAAAAAAAAAAAAAAABEBEhAEFRYZH/2gAIAQEAAT8QUKbhh11vrAdAcqzP/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="fork-join-1"\n        title=""\n        src="/blog/static/fork-join-1-4e5b8282e2b15dfd37966268ebb6b7c4-f8fb9.jpg"\n        srcset="/blog/static/fork-join-1-4e5b8282e2b15dfd37966268ebb6b7c4-e8976.jpg 148w,\n/blog/static/fork-join-1-4e5b8282e2b15dfd37966268ebb6b7c4-63df2.jpg 295w,\n/blog/static/fork-join-1-4e5b8282e2b15dfd37966268ebb6b7c4-f8fb9.jpg 590w,\n/blog/static/fork-join-1-4e5b8282e2b15dfd37966268ebb6b7c4-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/fork-join-2-05d3f1320821da8a2108754cfb8375e2-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAIBAwX/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAHZW4GJD//EABgQAAMBAQAAAAAAAAAAAAAAAAABEAMS/9oACAEBAAEFAjPpxin/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAYEAACAwAAAAAAAAAAAAAAAAAAEQEgIv/aAAgBAQAGPwKWzVf/xAAbEAABBAMAAAAAAAAAAAAAAAABEBEhMQCB4f/aAAgBAQABPyEEvUeMYmY31Kr/AP/aAAwDAQACAAMAAAAQYw//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/ED//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/ED//xAAbEAEBAQACAwAAAAAAAAAAAAABESEAEFGBsf/aAAgBAQABPxCkQ2vEz5xoByQjT0utm+eEBhOv/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="fork-join-2"\n        title=""\n        src="/blog/static/fork-join-2-05d3f1320821da8a2108754cfb8375e2-f8fb9.jpg"\n        srcset="/blog/static/fork-join-2-05d3f1320821da8a2108754cfb8375e2-e8976.jpg 148w,\n/blog/static/fork-join-2-05d3f1320821da8a2108754cfb8375e2-63df2.jpg 295w,\n/blog/static/fork-join-2-05d3f1320821da8a2108754cfb8375e2-f8fb9.jpg 590w,\n/blog/static/fork-join-2-05d3f1320821da8a2108754cfb8375e2-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">abstract</span> <span class="token keyword">class</span> Mailbox<span class="token punctuation">(</span><span class="token keyword">val</span> messageQueue<span class="token operator">:</span> MessageQueue<span class="token punctuation">)</span>\n  <span class="token keyword">extends</span> ForkJoinTask<span class="token punctuation">[</span><span class="token builtin">Unit</span><span class="token punctuation">]</span> \n  <span class="token keyword">with</span> SystemMessageQueue \n  <span class="token keyword">with</span> Runnable <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Execution (i.e. processing) of <code>Mailbox</code> is run on a different <code>Thread</code>, which was covered in <a href="../local-minimal-receiver">Local Actor workflow part 2 - Receiver side</a></p>\n<h2>Dispatcher and receiver-side behavior</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/fork-join-3-e78ec075a9caacb3f945ea642077c3f3-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIF/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB2bAsL//EABkQAAMAAwAAAAAAAAAAAAAAAAECEAAhMf/aAAgBAQABBQIHNRuLP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABcQAAMBAAAAAAAAAAAAAAAAAAERIDH/2gAIAQEABj8CLyv/xAAZEAEAAwEBAAAAAAAAAAAAAAABABEhEKH/2gAIAQEAAT8hQddZcFOPsuEdQhfP/9oADAMBAAIAAwAAABDsz//EABcRAQADAAAAAAAAAAAAAAAAAAEQEWH/2gAIAQMBAT8QLHI//8QAFhEBAQEAAAAAAAAAAAAAAAAAARAR/9oACAECAQE/EFdn/8QAHRABAAMAAQUAAAAAAAAAAAAAAQARITEQUWFxsf/aAAgBAQABPxBDRXYJnHqbws8oBMbhEFlzAAcfOn//2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="fork-join-3"\n        title=""\n        src="/blog/static/fork-join-3-e78ec075a9caacb3f945ea642077c3f3-f8fb9.jpg"\n        srcset="/blog/static/fork-join-3-e78ec075a9caacb3f945ea642077c3f3-e8976.jpg 148w,\n/blog/static/fork-join-3-e78ec075a9caacb3f945ea642077c3f3-63df2.jpg 295w,\n/blog/static/fork-join-3-e78ec075a9caacb3f945ea642077c3f3-f8fb9.jpg 590w,\n/blog/static/fork-join-3-e78ec075a9caacb3f945ea642077c3f3-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>When <code>run</code> method of <code>ForkJoinTask</code> is executed, the <a href="https://github.com/akka/akka/blob/v2.5.9/akka-actor/src/main/scala/akka/dispatch/Mailbox.scala#L250">following method of <code>Mailbox</code></a> is called, </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token annotation punctuation">@tailrec</span> <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">def</span> processMailbox<span class="token punctuation">(</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token comment">// def dequeue(): Envelope = messageQueue.dequeue()</span>\n  <span class="token keyword">val</span> next <span class="token operator">=</span> dequeue<span class="token punctuation">(</span><span class="token punctuation">)</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  actor invoke next\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  processMailbox<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>it picks up a message from the message queue, and process it.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/receiver-f0223f90103cfd6c6c14d2fd0a087fd8-db559.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.25%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAECBP/EABUBAQEAAAAAAAAAAAAAAAAAAAME/9oADAMBAAIQAxAAAAHe70TFYyhf/8QAGRABAQADAQAAAAAAAAAAAAAAAQIAETEh/9oACAEBAAEFAmr2NuHHsnmf/8QAGBEAAgMAAAAAAAAAAAAAAAAAAQMQETH/2gAIAQMBAT8BC60x/8QAGREAAgMBAAAAAAAAAAAAAAAAAAIBESED/9oACAECAQE/AU7M2QRdaf/EABcQAAMBAAAAAAAAAAAAAAAAAAABMSD/2gAIAQEABj8CpXn/xAAZEAEAAwEBAAAAAAAAAAAAAAABABEhMUH/2gAIAQEAAT8htbVeTUMI7jnBRkAOT//aAAwDAQACAAMAAAAQuA//xAAXEQEAAwAAAAAAAAAAAAAAAAABEBGR/9oACAEDAQE/EHVprH//xAAZEQEAAgMAAAAAAAAAAAAAAAABABEhQWH/2gAIAQIBAT8QTRL7MTaf/8QAHBABAQACAgMAAAAAAAAAAAAAAREAITFBUZHw/9oACAEBAAE/EBKQsgxWF0I7+36yexPI5oJwrcSnYveGwQz/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="receiver"\n        title=""\n        src="/blog/static/receiver-f0223f90103cfd6c6c14d2fd0a087fd8-f8fb9.jpg"\n        srcset="/blog/static/receiver-f0223f90103cfd6c6c14d2fd0a087fd8-e8976.jpg 148w,\n/blog/static/receiver-f0223f90103cfd6c6c14d2fd0a087fd8-63df2.jpg 295w,\n/blog/static/receiver-f0223f90103cfd6c6c14d2fd0a087fd8-f8fb9.jpg 590w,\n/blog/static/receiver-f0223f90103cfd6c6c14d2fd0a087fd8-db559.jpg 640w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>So this <code>processMailbox</code> method, called from <code>ForkJoinTask</code>’s <code>run</code> is what invokes your <code>receive</code> method you defined in your <code>Actor</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">class</span> MyActor <span class="token keyword">extends</span> Actor <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> receive <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>  \n  <span class="token punctuation">}</span>  \n<span class="token punctuation">}</span>\n</code></pre>\n      </div>',
frontmatter:{title:"Dispatcher behavior",date:"February 12, 2018"}}},pathContext:{slug:"/dispatcher-behavior/"}}}});
//# sourceMappingURL=path---dispatcher-behavior-782b55813a3263d90898.js.map