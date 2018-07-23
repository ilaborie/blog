webpackJsonp([60715732367920],{413:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/akka-http-stream-integration/index.md absPath of file >>> MarkdownRemark",html:'<p>As I started writing <a href="">articles about Akka HTTP</a>, I just wondered whether Akka HTTP integrates with Akka Stream like this - plug in my own <code class="language-text">Flow</code> into the stream of Akka HTTP:</p>\n<p><img src="/blog/wrong-assumption-c72a2fbada2eb0bd7d95fa611a6ebc0c.jpg" alt="wrong-assumption"></p>\n<p>After looking through the official doc, I found no section talking about integration like that, and in the end of long search in google, I encountered this <a href="https://stackoverflow.com/questions/36294428/akka-http-complete-request-with-flow">Stack Overflow entry</a> </p>\n<blockquote>\n<p>maybe the only way is to wire and materialize a new flow (upon each HttpRequest)</p>\n</blockquote>\n<p><strong>Really</strong>?</p>\n<p>Really. It turned out that the Stack Overflow answer was correct - <strong>we cannot do what is in the above diagram</strong>, as far as I checked, and I will explain why, in this article.</p>\n<h2>The requirement:</h2>\n<p>First of all, why did I want the integration in that way? What was the nice thing about it?</p>\n<p>The reason was this; We might have <strong>existing busines logic</strong> implemented in Akka Stream, leveraging its nice features like throttling, logging, etc. </p>\n<p>Also implementing the business logic in Akka Stream gives you a declarative explanation of the logic.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token comment">// Akka stream code as explanation of the steps</span>\nsource\n  <span class="token punctuation">.</span>throttling<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">1.</span>second<span class="token punctuation">)</span> <span class="token comment">//5 elements per second</span>\n  <span class="token punctuation">.</span>mapAsync<span class="token punctuation">(</span>externalService<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>via<span class="token punctuation">(</span>validateServiceResult<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>via<span class="token punctuation">(</span>transformServiceResult<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>mapAsync<span class="token punctuation">(</span>reporMetricService<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>log<span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>to<span class="token punctuation">(</span>databaseSink<span class="token punctuation">)</span></code></pre>\n      </div>\n<p>This is much easier to trace down to the actual processing step, see the relationship between two consecutive steps in the stream, <strong>compared to</strong> debugging the business logic consisting of <strong>only Akka actors</strong>.</p>\n<p>With those advantages of Akka Stream, I felt it’s natural to think of integration with Akka HTTP.</p>\n<h3>Why the integration doesn’t work in that way …</h3>\n<p>However, the integration as in the previous diagram does not work. By looking at the signature of the <code class="language-text">bindAndHandle</code> method, which is to bring up an HTTP server instance, it becomes clearer. </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> bindAndHandle<span class="token punctuation">(</span>\n<span class="gatsby-highlight-code-line">  handler<span class="token operator">:</span>   Flow<span class="token punctuation">[</span>HttpRequest<span class="token punctuation">,</span> HttpResponse<span class="token punctuation">,</span> <span class="token builtin">Any</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n</span>  interface<span class="token operator">:</span> <span class="token builtin">String</span><span class="token punctuation">,</span> port<span class="token operator">:</span> <span class="token builtin">Int</span> <span class="token operator">=</span> DefaultPortForProtocol<span class="token punctuation">,</span>\n  connectionContext<span class="token operator">:</span> ConnectionContext <span class="token operator">=</span> defaultServerHttpContext<span class="token punctuation">,</span>\n  settings<span class="token operator">:</span>          ServerSettings    <span class="token operator">=</span> ServerSettings<span class="token punctuation">(</span>system<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  log<span class="token operator">:</span>               LoggingAdapter    <span class="token operator">=</span> system<span class="token punctuation">.</span>log<span class="token punctuation">)</span><span class="token punctuation">(</span>\n  <span class="token keyword">implicit</span> fm<span class="token operator">:</span> Materializer\n<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>ServerBinding<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span></code></pre>\n      </div>\n<p>The important part is the 2nd line, <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code>. </p>\n<p>Upon the start of an HTTP server, the <code class="language-text">bindAndHandle</code> method takes this <code class="language-text">Flow</code> as a parameter and this <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code> is a single processing step which <strong>cannot be divided into two</strong>, <code class="language-text">Flow[HttpRequest, T, _]</code> and <code class="language-text">Flow[U, HttpResponse, _]</code>. So the diagram I pasted earlier was incorerct, and more accurate one is like this:</p>\n<p><img src="/blog/more-precisejpg-170218accea1e43b74a5b37322b25320.jpg" alt="more-precise"></p>\n<h2>Coming back to the requirement - did we really need that in the first place?</h2>\n<p>My seemingly simple idea, turned out to be impossible. So, there must be something I was missing - if this is a natural requirement most people would want, then Akka HTTP API must have already allowed this. However, no one seems to have complained about it, although Akka HTTP has been ther for few years and been already stable. This leads me to a conclusion that what I was thinking was not very useful.</p>\n<p>Let’s come back to the requirement then - do we really want to integrate Akka Stream, well more precisely, <strong>existing business logic as</strong> <code class="language-text">Flow</code> into Akka HTTP’s <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code>?</p>\n<p><strong>Probably not</strong>. </p>\n<p>We can describe the business logic in plain Scala code, a chain of method executions, rather than Akka Stram.</p>\n<p>The first reason is why this is not needed is that, although I find Akka Stream’s DSL makes it easy to understand the whole chain of processing steps, it is <strong>only easier in comparison to a chain of Akka Actors</strong>. When using plain Scala code, method invoking chains could be easier, or as easy as Akka Stream to read.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token comment">// Akka stream code as explanation of the steps</span>\nsource\n  <span class="token punctuation">.</span>throttling<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">1.</span>second<span class="token punctuation">)</span> <span class="token comment">//5 elements per second</span>\n  <span class="token punctuation">.</span>mapAsync<span class="token punctuation">(</span>externalService<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>via<span class="token punctuation">(</span>validateServiceResult<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>via<span class="token punctuation">(</span>transformServiceResult<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>mapAsync<span class="token punctuation">(</span>reporMetricService<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>log<span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span>to<span class="token punctuation">(</span>persistDatabaseSink<span class="token punctuation">)</span></code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token comment">// vs. plain method invocation chain, (e.g. using for comprehension)</span>\n<span class="token keyword">def</span> externalService<span class="token punctuation">(</span>input<span class="token operator">:</span> Input<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>Data<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token keyword">def</span> validateServiceResult<span class="token punctuation">(</span>data<span class="token operator">:</span> Data<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Boolean</span> <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token keyword">def</span> transformServiceResult<span class="token punctuation">(</span>data<span class="token operator">:</span> Data<span class="token punctuation">)</span><span class="token operator">:</span> TransformedData <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token keyword">def</span> reportMetricService<span class="token punctuation">(</span>data<span class="token operator">:</span> TransformedData<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span><span class="token builtin">Unit</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token keyword">def</span> persistDatabase<span class="token punctuation">(</span>data<span class="token operator">:</span> TransformedData<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>TransformedData<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n\n<span class="token keyword">for</span> <span class="token punctuation">{</span>\n  data <span class="token keyword">&lt;-</span> externalService<span class="token punctuation">(</span>input<span class="token punctuation">)</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>validateServiceResult<span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  transformed <span class="token keyword">&lt;-</span> transformServiceResult<span class="token punctuation">(</span>data<span class="token punctuation">)</span>\n  _ <span class="token keyword">&lt;-</span> reportMetricService<span class="token punctuation">(</span>transformed<span class="token punctuation">)</span>\n  _ <span class="token keyword">&lt;-</span> persistDatabase<span class="token punctuation">(</span>transformed<span class="token punctuation">)</span>\n<span class="token punctuation">}</span> <span class="token keyword">yield</span> <span class="token punctuation">{</span>\n  log<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n  transformed\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Another reason is that since <a href="https://en.wikipedia.org/wiki/HTTP_pipelining">HTTP pipelining</a> is generally <a href="https://doc.akka.io/docs/akka-http/current/server-side/low-level-api.html#controlling-server-parallelism">discouraged</a>, <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code> waits until the HTTP response is consumed, before processing the next HTTP request.\nThis would make many of flow-control operators like <code class="language-text">throttle</code>, <code class="language-text">buffer</code>, etc not needed. </p>\n<p><img src="/blog/tcp-http-c12c2c403a96c9f005298166ef4c58d8.gif" alt="tcp-http"></p>\n<p>The third and the last reason I found was, although plugging in <code class="language-text">Flow</code> is not possible, but plugging in <code class="language-text">Source</code> is possible as described <a href="https://doc.akka.io/docs/akka-http/current/routing-dsl/source-streaming-support.html#source-streaming">here in the official doc</a>. So there are ways to control the throughput of your stream <strong>in a single HTTP request/response roundtrip</strong>, as long as it is implemented as <code class="language-text">Source</code> not <code class="language-text">Flow</code>.</p>\n<p><img src="/blog/source-streaming-0c26a76948eb07df6dcdde6108769bbb.gif" alt="source-streaming"></p>\n<p>Here I’ve covered my findings about Akka HTTP and Akka Stream integration. Hope this is useful for people who were thinking about similar integration ideas like mine, and also let me know if anyone finds what I was missing to discuss in the article.</p>',frontmatter:{title:"Akka HTTP and Akka Stream integration? Working differently from what I originally thought",date:"July 23, 2018"}}},pathContext:{slug:"/akka-http-stream-integration/"}}}});
//# sourceMappingURL=path---akka-http-stream-integration-bdbd3ac1ad8d69c3aaef.js.map