webpackJsonp([0xbac349952546],{516:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/nishyu/richardimaoka/blog/src/pages/hello-world-http-bench/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>TL;DR) Benchmarking Akka HTTP and Spray “Hello World” servers did not discover significant performance difference.</p>\n<ul>\n<li>On Macbook, with Intel CPU Core i5 2.6GHz 2 cores</li>\n</ul>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">Akka HTTP</th>\n<th align="center">Spray</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">1st attempt</td>\n<td align="right">34,494 req/sec</td>\n<td align="center">37,005 req/sec</td>\n</tr>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">41,469 req/sec</td>\n<td align="center">41,586 req/sec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">41,535 req/sec</td>\n<td align="center">42,438 req/sec</td>\n</tr>\n</tbody>\n</table>\n<ul>\n<li>On Windows, with Intel CPU Core i7-6700 3.4GHz 4 cores/8 threads</li>\n</ul>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">Akka HTTP</th>\n<th align="center">Spray</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">1st attempt</td>\n<td align="right">75,439 req/sec</td>\n<td align="center">80,108 req/sec</td>\n</tr>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">80,106 req/sec</td>\n<td align="center">80,453 req/sec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">79,608 req/sec</td>\n<td align="center">84,446 req/sec</td>\n</tr>\n</tbody>\n</table>\n<h2>Motivation</h2>\n<p>I am planning to write up articles analyzing Akka HTTP performance going forward, (probably about Akka internals too) so wanted to get familiar with tooling and procedure.</p>\n<p>So this very first article is pretty “rough”, but still this gives me an insight about Akka HTTP’s performance relative to Spray. I was interested in this relative performance analysis because one of Akka HTTP’s performance goals was to catch up with Spray’s performance.</p>\n<p>If you are conducting a serious performance analysis, you would not take benchmark in this way, as my “Hello World” server was too simple and I only used a single machine to run the server and the client, which hides whether the bottleneck was on the client or the server.</p>\n<h2>References</h2>\n<h3>akka-user discussion</h3>\n<p>There is a similiar discussion about Akka HTTP performance in the <a href="https://groups.google.com/forum/#!topic/akka-user/qhZlh0KBl2A">akka-user mailing list</a>, where the benchmark was taken using a tool called <a href="https://github.com/wg/wrk">wrk</a> against a simple serve doing hell-world json marshalling.</p>\n<blockquote>\n<p>Whereas for the Akka HTTP version I saw each core using ~40% CPU throughout the test and I had the following results:\n…</p>\n</blockquote>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>  2 threads and 100 connections\n  Thread calibration: mean lat.: 5.044ms, rate sampling interval: 10ms\n  Thread calibration: mean lat.: 5.308ms, rate sampling interval: 10ms\n  Thread Stats   Avg      Stdev     Max   +/- Stdev\n    Latency     1.83ms    1.27ms  78.91ms   95.96%\n    Req/Sec    10.55k     1.79k   28.22k    75.98%\n  5997552 requests in 5.00m, 1.00GB read\nRequests/sec:  19991.72\nTransfer/sec:      3.41MB</code></pre>\n      </div>\n<p>The number I foncus on this time, was <strong>req/sec: 19991.72</strong>. Of course we have to look at various characteristics of performance in more serious analsys, but this is just a starting point for now.</p>\n<h3>Spray team blog</h3>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/spray-bench-528d4a6d6788732badde292e0479e2a5-bb366.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 60.92124814264488%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAAA7CAAAOwgEVKEqAAAABgklEQVQoz51TS27CMBDlaG1VxBb1EFwDdog114ArsOsRKrVSSwVJydeOncSfJEivtqNAK6WldDEajUfz/ObNzIBzDq00jscjpJTQWjuvVOcVqqpy+T6LWQ5Kqauz8cAGjHEXWPAwjOD7HwiC0PnIxGlKUJblCaSua6zXa6xWq5NtNpsWkJAzICEBdrs9DocA+hdWQgiMH8YYjUa4ub3D/XCIyWTSAlpWlGY/FveZbW82m2GxWGA6nWI+n2O5XKJpGguYI7sSsDMmNYLnR6SmSwvmGGYZc9r9FURkAQhtARSLjLbiW94N5RKI5Al44kGaiUsewZJgUrkNaCoFHrwgSdLzUC5qpgRoKR0brio3lC7XCIKMsa8M+/VrKokojVEUhWORk7DdtyIx20DA87y37gRYG02quoEoUhChsYsP5vcUDX29alCDbge3KcX24w1xzl1b/5m6A7QtPXl7vIcJpJDITWxXSRrRrc+NCfPOzcdFUbqLoUZ3e1Ge58P3zldl3z4B3ayPJF2nR+IAAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="spray bench"\n        title=""\n        src="/blog/static/spray-bench-528d4a6d6788732badde292e0479e2a5-fb8a0.png"\n        srcset="/blog/static/spray-bench-528d4a6d6788732badde292e0479e2a5-1a291.png 148w,\n/blog/static/spray-bench-528d4a6d6788732badde292e0479e2a5-2bc4a.png 295w,\n/blog/static/spray-bench-528d4a6d6788732badde292e0479e2a5-fb8a0.png 590w,\n/blog/static/spray-bench-528d4a6d6788732badde292e0479e2a5-bb366.png 673w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Also there is a <a href="http://spray.io/blog/2013-05-24-benchmarking-spray/">Spray team blog entry</a> which shows its performance. As it says the benchmark server was doing JSON serialization without db access, it was probably similar to the above akka-user discussion.</p>\n<p>The req/sec was 33.8K in Spray but 19.9K in Akka HTTP. So my question was,\n”<strong>how do they perform on the same machine, doing the same thing?</strong>”</p>\n<p>Maybe the difference in their performance was due to the difference on the machines the benchmark was run, and probably because the code of one experiment was bit more complicated than the other.</p>\n<h2>My Bencmarking setup</h2>\n<p>I set up a very, very simple HTTP server in both in Akka HTTP and Spray, where the Spray one was inspired by its <a href="https://github.com/spray/spray-template">official template</a>.</p>\n<h3>Akka HTTP</h3>\n<p><a href="https://github.com/richardimaoka/resources/tree/master/akka-http-minimal">full code here</a> </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">import</span> java<span class="token punctuation">.</span>io<span class="token punctuation">.</span><span class="token punctuation">{</span>PrintWriter<span class="token punctuation">,</span> StringWriter<span class="token punctuation">}</span>\n\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>actor<span class="token punctuation">.</span>ActorSystem\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>Http\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>server<span class="token punctuation">.</span>Directives<span class="token punctuation">.</span>_\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>server<span class="token punctuation">.</span>Route\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>ActorMaterializer\n\n<span class="token keyword">import</span> scala<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>Await\n<span class="token keyword">import</span> scala<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>duration<span class="token punctuation">.</span>Duration\n\n<span class="token keyword">object</span> HttpServer <span class="token keyword">extends</span> <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> main<span class="token punctuation">(</span>args<span class="token operator">:</span> Array<span class="token punctuation">[</span><span class="token builtin">String</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> system<span class="token operator">:</span> ActorSystem <span class="token operator">=</span> ActorSystem<span class="token punctuation">(</span><span class="token string">"HttpServer"</span><span class="token punctuation">)</span>\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> materializer<span class="token operator">:</span> ActorMaterializer <span class="token operator">=</span> ActorMaterializer<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n    <span class="token keyword">lazy</span> <span class="token keyword">val</span> routes<span class="token operator">:</span> Route <span class="token operator">=</span>\n      pathEndOrSingleSlash <span class="token punctuation">{</span>\n        complete<span class="token punctuation">(</span><span class="token string">"Hello World"</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n\n    Http<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>bindAndHandle<span class="token punctuation">(</span>routes<span class="token punctuation">,</span> <span class="token string">"localhost"</span><span class="token punctuation">,</span> <span class="token number">8088</span><span class="token punctuation">)</span>\n    println<span class="token punctuation">(</span>s<span class="token string">"Server online at http://localhost:8088/"</span><span class="token punctuation">)</span>\n    Await<span class="token punctuation">.</span>result<span class="token punctuation">(</span>system<span class="token punctuation">.</span>whenTerminated<span class="token punctuation">,</span> Duration<span class="token punctuation">.</span>Inf<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3>Spray</h3>\n<p><a href="https://github.com/richardimaoka/resources/tree/master/spray-minimal">full code here</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code><span class="token keyword">import</span> akka<span class="token punctuation">.</span>actor<span class="token punctuation">.</span><span class="token punctuation">{</span>Actor<span class="token punctuation">,</span> ActorSystem<span class="token punctuation">,</span> Props<span class="token punctuation">}</span>\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>io<span class="token punctuation">.</span>IO\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>pattern<span class="token punctuation">.</span>ask\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>util<span class="token punctuation">.</span>Timeout\n<span class="token keyword">import</span> spray<span class="token punctuation">.</span>can<span class="token punctuation">.</span>Http\n<span class="token keyword">import</span> spray<span class="token punctuation">.</span>routing<span class="token punctuation">.</span>HttpService\n\n<span class="token keyword">import</span> scala<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>duration<span class="token punctuation">.</span>_\n\n<span class="token comment">// this trait defines our service behavior independently from the service actor</span>\n<span class="token keyword">trait</span> MyService <span class="token keyword">extends</span> HttpService <span class="token punctuation">{</span>\n  <span class="token keyword">val</span> myRoute <span class="token operator">=</span>\n    path<span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      complete<span class="token punctuation">(</span><span class="token string">"Hello World"</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// we don\'t implement our route structure directly in the service actor because</span>\n<span class="token comment">// we want to be able to test it independently, without having to spin up an actor</span>\n<span class="token keyword">class</span> MyServiceActor <span class="token keyword">extends</span> Actor <span class="token keyword">with</span> MyService <span class="token punctuation">{</span>\n\n  <span class="token comment">// the HttpService trait defines only one abstract member, which</span>\n  <span class="token comment">// connects the services environment to the enclosing actor or test</span>\n  <span class="token keyword">def</span> actorRefFactory <span class="token operator">=</span> context\n\n  <span class="token comment">// this actor only runs our route, but you could add</span>\n  <span class="token comment">// other things here, like request stream processing</span>\n  <span class="token comment">// or timeout handling</span>\n  <span class="token keyword">def</span> receive <span class="token operator">=</span> runRoute<span class="token punctuation">(</span>myRoute<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n\n<span class="token keyword">object</span> HttpServer <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> main<span class="token punctuation">(</span>args<span class="token operator">:</span> Array<span class="token punctuation">[</span><span class="token builtin">String</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token comment">// we need an ActorSystem to host our application in</span>\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> system <span class="token operator">=</span> ActorSystem<span class="token punctuation">(</span><span class="token string">"on-spray-can"</span><span class="token punctuation">)</span>\n\n    <span class="token comment">// create and start our service actor</span>\n    <span class="token keyword">val</span> service <span class="token operator">=</span> system<span class="token punctuation">.</span>actorOf<span class="token punctuation">(</span>Props<span class="token punctuation">[</span>MyServiceActor<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">"demo-service"</span><span class="token punctuation">)</span>\n\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> timeout <span class="token operator">=</span> Timeout<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">.</span>seconds<span class="token punctuation">)</span>\n    <span class="token comment">// start a new HTTP server on port 8090 with our service actor as the handler</span>\n    IO<span class="token punctuation">(</span>Http<span class="token punctuation">)</span> <span class="token operator">?</span> Http<span class="token punctuation">.</span>Bind<span class="token punctuation">(</span>service<span class="token punctuation">,</span> interface <span class="token operator">=</span> <span class="token string">"localhost"</span><span class="token punctuation">,</span> port <span class="token operator">=</span> <span class="token number">8090</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3>Benchmarking method in detail</h3>\n<p>Same as the akka-user discussion, I used <a href="https://github.com/wg/wrk">wrk</a> to test the servers. On my Macbook (with Intel CPU Core i5 2.6GHz 2 cores), and got the following results for req/sec. This is the same table as I pasted at the beginning of the article. </p>\n<p>The reason I tried 3 attempts each was that due to JVM’s JIT (Just-in-time) compilation, the frist and probably second attemps might not be at at the possible best performance. </p>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">Akka HTTP</th>\n<th align="center">Spray</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">1st attempt</td>\n<td align="right">34,494 req/sec</td>\n<td align="center">37,005 req/sec</td>\n</tr>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">41,469 req/sec</td>\n<td align="center">41,586 req/sec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">41,535 req/sec</td>\n<td align="center">42,438 req/sec</td>\n</tr>\n</tbody>\n</table>\n<p>Taking more detailed results from the 3rd attempts, for <strong>Akka HTTP</strong>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> wrk -t2 -c100 -d30s http://127.0.0.1:8088\nRunning 30s test @ http://127.0.0.1:8088\n  2 threads and 100 connections\n  Thread Stats   Avg      Stdev     Max   +/- Stdev\n    Latency     3.88ms   18.33ms 485.74ms   97.91%\n    Req/Sec    21.02k     4.59k   35.18k    82.57%\n  1248199 requests in 30.05s, 184.51MB read\nRequests/sec:  41535.58\nTransfer/sec:      6.14MB</code></pre>\n      </div>\n<p>and for <strong>Spray</strong>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> wrk -t2 -c100 -d30s http://127.0.0.1:8090\nRunning 30s test @ http://127.0.0.1:8090\n  2 threads and 100 connections\n  Thread Stats   Avg      Stdev     Max   +/- Stdev\n    Latency     3.98ms   11.38ms 163.62ms   94.70%\n    Req/Sec    21.60k     5.89k   48.67k    77.40%\n  1273545 requests in 30.01s, 185.83MB read\nRequests/sec:  42438.22\nTransfer/sec:      6.19MB</code></pre>\n      </div>\n<p>They look like performing in a similar level. </p>\n<p>Then I did the same thing on my Windows machine as well (with Intel CPU Core i7-6700 3.4GHz 4 cores/8 threads), and results were as follows:</p>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">Akka HTTP</th>\n<th align="center">Spray</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">1st attempt</td>\n<td align="right">75,439 req/sec</td>\n<td align="center">80,108 req/sec</td>\n</tr>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">80,106 req/sec</td>\n<td align="center">80,453 req/sec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">79,608 req/sec</td>\n<td align="center">84,446 req/sec</td>\n</tr>\n</tbody>\n</table>\n<p>Detailed results from the 3rd attempt for <strong>Akka HTTP</strong>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> wrk -t2 -c100 -d30s http://127.0.0.1:8095/\nRunning 30s test @ http://127.0.0.1:8095/\n  2 threads and 100 connections\n  Thread Stats   Avg      Stdev     Max   +/- Stdev\n    Latency     1.46ms    6.53ms 260.11ms   98.93%\n    Req/Sec     40.08k    6.85k   59.53k    64.67%\n  2395691 requests in 30.09s, 354.13MB read\nRequests/sec:  79608.66\nTransfer/sec:     11.77MB</code></pre>\n      </div>\n<p>and for <strong>Spray</strong>, and these also gave similar perforamance.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> wrk -t2 -c100 -d30s http://127.0.0.1:8093/\nRunning 30s test @ http://127.0.0.1:8093/\n  2 threads and 100 connections\n  Thread Stats   Avg      Stdev     Max   +/- Stdev\n    Latency     1.18ms    2.68ms  61.62ms   98.26%\n    Req/Sec    42.55k     8.20k   61.00k    61.10%\n  2542858 requests in 30.11s, 371.03MB read\nRequests/sec:  84446.09\nTransfer/sec:     12.32MB</code></pre>\n      </div>\n<p>Here’s the CPU usage profile on Windows at one point running the benchmark. The “Java” one is the Akka HTTP server. </p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/blog/static/win-cpu-utilization-8606513a030db443d74a33bdfdd8810d-8290b.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 93.01675977653632%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAACXBIWXMAAA7CAAAOwgEVKEqAAAACaElEQVQ4y52U3W7TQBCF/cxc8QJc8QZcc8MFIEBF4goJVBWpQqqqlJI0aey14/gn9saOvd71Tw4zDg1JACWw0sg7u86Xs+PZYxljEMcx6rrGsbFer9G2LbquQ9M02+D8IaxKKXiehzzPjwKX2RKLJEGSpkhliizLIKVESnlC60EYwlJ1g6puTwo7KeFJBTdV/fMw/GW1Abbd+mgoAiaFgaRIfz4Pg/f/ChSuiyAItzHz5xAzH2I6xeTrBa4+f4QtPFxdD/r1we0QIkh+B+qm65/D8RR5qaFMuxdlEkJfvoa8eIVlTrWTMbRRkJnEcOruA03bIas2+VgEmHgRZkmBpcY2stRHdvMU7pcnmDkfMLp5g0VwjtG39wQU9JUJ2FE7cHCdSlLB8yAIEEYxFHXBXusULprRYywuH6Hwn8O7fQYVn8G/e7EB7ipk2Eo3qEmpbdsY0wu2IyCES/VycW9Tfv8d9vAt7q5fYnx7huHgHZzJOcbDT7D9iICm3gIL0yCnI6flZm2xMvCzqp8vVb39mid/ZVbnUK8taIPzeKUhqOf+C9iwIlpYEMSVG0iY6x7Kc1n+A7ChO5iTujkdjzdYJdcx2gOa04AFgQICzena8PVhCCvja8Rz3osIyn/G+Wb/1/wwrLo2iKKob4+yLLftwc5RFAUqrfucjWB3/0+DnchqyX5s24GuKvi+j/l8DkNW1nVt7yIdHZcH29wpw2IfDMl2NCnxPBeKwAxlNeyTbE9VpSFTeRLUMkb3R+Yj8o8bkl2WRV8CzpWq+heF42C1Ko4DWZkQAq4repW7NWTTfXDymK4hl+XY+AGx3bVvnR6VswAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="win-cpu-utilization"\n        title=""\n        src="/blog/static/win-cpu-utilization-8606513a030db443d74a33bdfdd8810d-fb8a0.png"\n        srcset="/blog/static/win-cpu-utilization-8606513a030db443d74a33bdfdd8810d-1a291.png 148w,\n/blog/static/win-cpu-utilization-8606513a030db443d74a33bdfdd8810d-2bc4a.png 295w,\n/blog/static/win-cpu-utilization-8606513a030db443d74a33bdfdd8810d-fb8a0.png 590w,\n/blog/static/win-cpu-utilization-8606513a030db443d74a33bdfdd8810d-8290b.png 716w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>In a realistic situation where you, typically need to read and write to and from databases, etc, your web server won’t be using CPU up to 100%, but network/database I/O tend to be bottlenecks. </p>\n<p>For now the experiment in this article tells us how the server behaves in the best possible situation where the CPU becomes the bottleneck.</p>\n<h2>Lessons learned and plans going forward …</h2>\n<p>Just don’t rely on these results and assume like “Akka HTTP and Spray can perform at this level!“.</p>\n<p>As you saw here, benchmark results could significantly vary based on machines you run the bench. We have to keep in mind that the benchmark results are specific to the setup, including machines you run the bench, the server implementation and what kind of work the server does, latency and throughput between components if there are multiple components involved, etc.</p>\n<p>Also, what “realistic” benchmark actually means depends on what your target application (web server) is. We have to pay attention that the difference between application’s production environment and the benchmark environment.</p>\n<p>Although having realistic setup, close to your production environment is important, another thing to note is that there is no one-size-fits-all benchmark method. Like anything else in software engineering, you should have differnt tooling for different aspects of benchmarking. You might think that if you make the benchmark environment as close as your production environment, you will get the most accurate results and that’s it. However, that way, you cannot identify which component is the bottleneck of the performance when you see your entire application’s performance is not satisfactory. You need more granular results from different parts of the system.</p>\n<p>That is why I did this very simple, ridiculously simple benchmarking. This didn’t give us any realistic performance figure which we can guess the production performance from, but it gave me a sense on maximum possible performance of Akka HTTP web server. (Actually, better experiment is to run the client and the server on different machines though.)</p>\n<p>By testing each component individually, also testing in small groups of components, you will then realize the performance cap of each part of your entire application. Comparing that with your benchmark agains the whole application system, you will be able to figure out what is the bottleneck, and what part of the application is not scaling as you would have expected.</p>\n<p>So I am going to write up other articles to cover these aspects to show procedure on performing (web) application performance testing, and hopefully micro benchmarking internals of akka application/service too.</p>',frontmatter:{title:"Benchmarking Spray and Akka HTTP Hello World servers",date:"March 03, 2018"}}},pathContext:{slug:"/hello-world-http-bench/"}}}});
//# sourceMappingURL=path---hello-world-http-bench-c8b6056acec29b53f862.js.map