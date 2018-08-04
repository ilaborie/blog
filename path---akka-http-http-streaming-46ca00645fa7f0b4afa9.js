webpackJsonp([0xf817c8b95c8e],{418:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/akka-http-http-streaming/index.md absPath of file >>> MarkdownRemark",html:'<p>The previous article <a href="./akka-http-tcp-streaming/">Akka HTTP and TCP streaming</a> introduced how Akka HTTP processes data in a streaming fashion at the TCP layer. Now I am going to explain the streaming behavior at the HTTP request/response level. </p>\n<p><img src="/blog/http-streaming-c69314456167bfaefbf771597c295028.gif" alt="http-streaming"></p>\n<p>The above animation illustrates streaming in Akka HTTP at the HTTP layer. Each HTTP request is converted to an HTTP response in the end, and this conversion logic is called the <code class="language-text">handler</code> here, which is passed to the <code class="language-text">bindAndHandle</code> method to start up the HTTP server.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>Http\nHttp<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>bindAndHandle<span class="token punctuation">(</span>handler<span class="token punctuation">,</span> <span class="token string">"localhost"</span><span class="token punctuation">,</span> <span class="token number">8080</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p>The <code class="language-text">handler</code> has the type of <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code> as you can see from the signature of the <code class="language-text">bindAndHandle</code> method.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> bindAndHandle<span class="token punctuation">(</span>\n<span class="gatsby-highlight-code-line">  handler<span class="token operator">:</span>   Flow<span class="token punctuation">[</span>HttpRequest<span class="token punctuation">,</span> HttpResponse<span class="token punctuation">,</span> <span class="token builtin">Any</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n</span>  interface<span class="token operator">:</span> <span class="token builtin">String</span><span class="token punctuation">,</span> port<span class="token operator">:</span> <span class="token builtin">Int</span> <span class="token operator">=</span> DefaultPortForProtocol<span class="token punctuation">,</span>\n  connectionContext<span class="token operator">:</span> ConnectionContext <span class="token operator">=</span> defaultServerHttpContext<span class="token punctuation">,</span>\n  settings<span class="token operator">:</span>          ServerSettings    <span class="token operator">=</span> ServerSettings<span class="token punctuation">(</span>system<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  log<span class="token operator">:</span>               LoggingAdapter    <span class="token operator">=</span> system<span class="token punctuation">.</span>log<span class="token punctuation">)</span><span class="token punctuation">(</span>\n  <span class="token keyword">implicit</span> fm<span class="token operator">:</span> Materializer\n<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>ServerBinding<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span></code></pre>\n      </div>\n<p>So the <code class="language-text">handler</code> in Akka HTTP convertes <code class="language-text">HttpRequest</code> into <code class="language-text">HttpResponse</code> and that’s where you application-level logic resides.</p>\n<h2>High-level and Low-level APIs</h2>\n<p>The <code class="language-text">handler</code> in type of  <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code>, can be implemented in two ways in Akka HTTP.</p>\n<p>In this article, I’m going to introduce them very briefly, and discuss them in much more detail in separate articles.</p>\n<p>The first way is to use the <a href="https://doc.akka.io/docs/akka-http/current/introduction.html#routing-dsl-for-http-servers">high-level API</a> with <a href="https://doc.akka.io/docs/akka-http/current/routing-dsl/index.html">Routing DSL</a>. Interestingly, the <code class="language-text">handler</code> written in Routing DSL has the type of <code class="language-text">Route</code> not <code class="language-text">Flow</code>, but there is type-class based implicit resolution going on, to convert the <code class="language-text">Route</code> to <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code> behind the scene.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">val</span> route<span class="token operator">:</span> Route <span class="token operator">=</span> path<span class="token punctuation">(</span><span class="token string">"..."</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  get <span class="token punctuation">{</span>\n    complete<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// route: Route is resolved to Flow[HttpRequest, HttpResponse, Any]</span>\n<span class="token comment">// by type-class based implicits</span>\nHttp<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>bindAndHandle<span class="token punctuation">(</span>route <span class="token comment">/*route as handler*/</span><span class="token punctuation">,</span> <span class="token string">"localhost"</span><span class="token punctuation">,</span> <span class="token number">8080</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p>Writing the <code class="language-text">handler</code> in Routing DSL in most cases is much easier than writing <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code> directly. So most of the cases you would go with the high level API. </p>\n<p>However, as the <a href="https://doc.akka.io/docs/akka-http/current/introduction.html#philosophy">philosophy</a> of Akka HTTP says, in case it is more suitable to directly implement the <code class="language-text">HttpRequest</code> to <code class="language-text">HttpResponse</code> conversoin logic rather than <code class="language-text">Route</code>, Akka HTTP also offers the <a href="https://doc.akka.io/docs/akka-http/current/introduction.html#low-level-http-server-apis">low-level API</a>, and we can directly implement the handler in <code class="language-text">HttpRequest =&gt; HttpResponse</code> as follows.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">val</span> handler<span class="token operator">:</span> HttpRequest <span class="token keyword">=></span> HttpResponse <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">case</span> HttpRequest<span class="token punctuation">(</span>GET<span class="token punctuation">,</span> Uri<span class="token punctuation">.</span>Path<span class="token punctuation">(</span><span class="token string">"/"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> _<span class="token punctuation">,</span> _<span class="token punctuation">,</span> _<span class="token punctuation">)</span> <span class="token keyword">=></span>\n    HttpResponse<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\nHttp<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>bindAndHandleSync<span class="token punctuation">(</span>handler<span class="token punctuation">,</span> <span class="token string">"localhost"</span><span class="token punctuation">,</span> <span class="token number">8080</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p><code class="language-text">HttpRequest =&gt; HttpResponse</code> can be passed to <code class="language-text">bindAndHandleSync</code> which is internally converted to <code class="language-text">Flow[HttpRequest, HttpResponse, Any]</code>. Note that we used <code class="language-text">bindAndhHandleSync</code> which is different from <code class="language-text">bindAndHandle</code> wa saw earlier.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> bindAndHandleAsync<span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span> \n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n  bindAndHandle<span class="token punctuation">(</span>\n<span class="gatsby-highlight-code-line">    Flow<span class="token punctuation">[</span>HttpRequest<span class="token punctuation">]</span><span class="token punctuation">.</span>mapAsync<span class="token punctuation">(</span>parallelism<span class="token punctuation">)</span><span class="token punctuation">(</span>handler<span class="token punctuation">)</span><span class="token punctuation">,</span>\n</span>    interface<span class="token punctuation">,</span>\n    port<span class="token punctuation">,</span>\n    connectionContext<span class="token punctuation">,</span>\n    settings<span class="token punctuation">,</span>\n    log<span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<h2>HTTP Pipelining</h2>\n<p>HTTP pipelining means processing the next HTTP request before sending the HTTP response for the current HTTP request. </p>\n<p><img src="/blog/http-pipelining-d298d6f3bf0bcd5880b547fb684621d3.gif" alt="http-pipelining"></p>\n<p>Compare it with the animation we saw earlier, without pipelining.</p>\n<p><img src="/blog/http-streaming-c69314456167bfaefbf771597c295028.gif" alt="http-streaming"></p>\n<p>Although it is <a href="https://doc.akka.io/docs/akka-http/current/server-side/low-level-api.html#controlling-server-parallelism">generally discouraged</a>, also <a href="https://en.wikipedia.org/w/index.php?title=HTTP_pipelining&#x26;oldid=700966692#Implementation_in_web_browsers">disabled by most browsers</a>, HTTP pipelining is still supported in Akka HTTP. It can be achieved by either:</p>\n<ul>\n<li>Changing <code class="language-text">akka.http.server.pipelining-limit</code> config value, or</li>\n<li>Passing the <code class="language-text">parallelism</code> parameter to the <code class="language-text">bindAndHandleAsync</code> method under the <code class="language-text">Http</code> object (default = 1, i.e. pipelining disabled)</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">def</span> bindAndHandleAsync<span class="token punctuation">(</span>\n  handler<span class="token operator">:</span>   HttpRequest ⇒ Future<span class="token punctuation">[</span>HttpResponse<span class="token punctuation">]</span><span class="token punctuation">,</span>\n  interface<span class="token operator">:</span> <span class="token builtin">String</span><span class="token punctuation">,</span> port<span class="token operator">:</span> <span class="token builtin">Int</span> <span class="token operator">=</span> DefaultPortForProtocol<span class="token punctuation">,</span>\n  connectionContext<span class="token operator">:</span> ConnectionContext <span class="token operator">=</span> defaultServerHttpContext<span class="token punctuation">,</span>\n  settings<span class="token operator">:</span>          ServerSettings    <span class="token operator">=</span> ServerSettings<span class="token punctuation">(</span>system<span class="token punctuation">)</span><span class="token punctuation">,</span>\n<span class="gatsby-highlight-code-line">  parallelism<span class="token operator">:</span>       <span class="token builtin">Int</span>               <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span>\n</span>  log<span class="token operator">:</span>               LoggingAdapter    <span class="token operator">=</span> system<span class="token punctuation">.</span>log<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">implicit</span> fm<span class="token operator">:</span> Materializer\n<span class="token punctuation">)</span><span class="token operator">:</span> Future<span class="token punctuation">[</span>ServerBinding<span class="token punctuation">]</span></code></pre>\n      </div>\n<p>Again, HTTP pipelining is a discouraged practice, so if you need to enable this feature, be warned about unwanted consequences.</p>',frontmatter:{title:"Akka HTTP streaming at the HTTP layer",date:"July 27, 2018"}}},pathContext:{slug:"/akka-http-http-streaming/"}}}});
//# sourceMappingURL=path---akka-http-http-streaming-46ca00645fa7f0b4afa9.js.map