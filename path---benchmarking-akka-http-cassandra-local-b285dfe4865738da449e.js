webpackJsonp([0xc395c68b0752],{428:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/benchmarking-akka-http-cassandra-local/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>Although what I tried here does not give realistic or useful results, this is another step forward in my experiment to set up benchmarking environment for Akka and Akka HTTP. I am going to add persistence to Cassandra to the system, to see how the benchmark figures are affected.</p>\n<p>The source code is available <a href="https://github.com/richardimaoka/resources/tree/master/akka-http-cassandra">here</a></p>\n<h2>Results</h2>\n<p>In the previous article, <a href="../hello-world-http-bench/">Benchmarking Spray and Akka HTTP Hello World servers</a>, the web server just returned the constant response. Here I am comparing three different types of web servers.</p>\n<ol>\n<li>Akka HTTP server with JSON marshalling/unmarshalling</li>\n<li>Akka HTTP server with JSON marshalling/unmarshalling, and in-memory persistence</li>\n<li>Akka HTTP server with JSON marshalling/unmarshalling, and akka-persistence-cassandra</li>\n</ol>\n<p>Like explained in the previous article, the 1st attempt in benchmarking could be affected by incomplete JIT compliation. So I only show results from the 2nd and 3rd attempts here.</p>\n<p><img src="/blog/result-throughput-3544dab712b097d012ff0e9a0bdcd1c2.png" alt="result-throughput"></p>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">1. JSON</th>\n<th align="center">2. In-Memory</th>\n<th align="center">3. Cassandra</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">52,196 req/sec</td>\n<td align="center">27,507 req/sec</td>\n<td align="center">992 req/sec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">48,293 req/sec</td>\n<td align="center">30,746 req/sec</td>\n<td align="center">1,122 req/sec</td>\n</tr>\n</tbody>\n</table>\n<p>Comparing the throughput, obviously adding Cassandra and <strong>wait the HTTP response until Cassandra persistence is done</strong> makes the performance order of magnitude going down, and the CPU usage for 3 were around 40% although that of 1 and 2 topped at 100% like the prevoius article. (i.e.) The bottleneck is shifted to database I/O from CPU resource competition between the web client and server.</p>\n<p><img src="/blog/task-manager-cassandra-28eacb07076bda4e4e3e719c9ea2bbd4.png" alt="task-manager-cassandra"></p>\n<p>The below is the comparison of average latency,</p>\n<p><img src="/blog/result-avg-e50ee60c1c8f0bb8139a305139f4fee7.png" alt="result-avg"></p>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">1. JSON</th>\n<th align="center">2. In-Memory</th>\n<th align="center">3. Cassandra</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">2.17 millisec</td>\n<td align="center">2.41 millisec</td>\n<td align="center">101.55 millisec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">2.16 millisec</td>\n<td align="center">2.10 millisec</td>\n<td align="center">88.92 millisec</td>\n</tr>\n</tbody>\n</table>\n<p>and the max latency.</p>\n<p><img src="/blog/result-max-f3d8c0283cbc8fde4f269ae52a69683d.png" alt="result-max"></p>\n<table>\n<thead>\n<tr>\n<th align="left">Attempt</th>\n<th align="right">1. JSON</th>\n<th align="center">2. In-Memory</th>\n<th align="center">3. Cassandra</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">2nd attempt</td>\n<td align="right">321.87 millisec</td>\n<td align="center">452.84 millisec</td>\n<td align="center">335.73 millisec</td>\n</tr>\n<tr>\n<td align="left">3rd attempt</td>\n<td align="right">267.60 millisec</td>\n<td align="center">119.31 millisec</td>\n<td align="center">199.44 millisec</td>\n</tr>\n</tbody>\n</table>\n<p>From here, let’s see how I set up the servers for 1, 2 and 3.</p>\n<h2>1. JSON marshalling/unmarshalling</h2>\n<p>I am not going in detail, but JSON marshalling is converting a Scala case class instance to JSON payload, and unmarshalling is the opposite.</p>\n<p><img src="/blog/json-marshalling-f0d34e54e0382932b6cdb0928eba76fe.jpg" alt="json-marshalling"></p>\n<p>This HttpServer does simple stuff, to sum up all the <code class="language-text">&quot;score&quot;</code> sent in HTTP responses, and return the current total, average and number of trials (number of HTTP requests) so far.</p>\n<p>Let’s define case classes to marshall to/unmarshall from JSON:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token comment">//JSON request {"score": 10} can be unmarshalled to this</span>\n<span class="token keyword">case</span> <span class="token keyword">class</span> ScoringRequest<span class="token punctuation">(</span>\n  score<span class="token operator">:</span> <span class="token builtin">Double</span>\n<span class="token punctuation">)</span>\n\n<span class="token comment">//This case class can be marshalled to JSON response {"averageScore": ... }</span>\n<span class="token keyword">case</span> <span class="token keyword">class</span> ScoreResponse<span class="token punctuation">(</span>\n  averageScore<span class="token operator">:</span> <span class="token builtin">Double</span><span class="token punctuation">,</span>\n  totalScore<span class="token operator">:</span> <span class="token builtin">Double</span><span class="token punctuation">,</span>\n  numberOfTrials<span class="token operator">:</span> <span class="token builtin">Long</span>\n<span class="token punctuation">)</span></code></pre>\n      </div>\n<p>To enable marshlling and unmarshalling, I used <code class="language-text">SprayJsonSupport</code> as follows: </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>marshallers<span class="token punctuation">.</span>sprayjson<span class="token punctuation">.</span>SprayJsonSupport\n<span class="token keyword">import</span> spray<span class="token punctuation">.</span>json<span class="token punctuation">.</span>DefaultJsonProtocol\n\n<span class="token keyword">object</span> ScoringJsonSupport <span class="token keyword">extends</span> DefaultJsonProtocol <span class="token keyword">with</span> SprayJsonSupport <span class="token punctuation">{</span>\n  <span class="token keyword">implicit</span> <span class="token keyword">val</span> scoringRequestFormat <span class="token operator">=</span> jsonFormat1<span class="token punctuation">(</span>ScoringRequest<span class="token punctuation">)</span>\n  <span class="token keyword">implicit</span> <span class="token keyword">val</span> scoreResponseFormat <span class="token operator">=</span> jsonFormat3<span class="token punctuation">(</span>ScoreResponse<span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>And the route becomes like this.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">import</span> ScoringJsonSupport<span class="token punctuation">.</span>_\n<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token keyword">val</span> routes<span class="token operator">:</span> Route <span class="token operator">=</span>\n  path<span class="token punctuation">(</span><span class="token string">"scoring"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    post <span class="token punctuation">{</span>\n      entity<span class="token punctuation">(</span>as<span class="token punctuation">[</span>ScoringRequest<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> request <span class="token keyword">=></span>\n        updateState<span class="token punctuation">(</span>request<span class="token punctuation">.</span>score<span class="token punctuation">)</span>\n        complete <span class="token punctuation">{</span>\n          ScoreResponse<span class="token punctuation">(</span>averageScore<span class="token punctuation">,</span> totalScore<span class="token punctuation">,</span> numberOfTrials<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span></code></pre>\n      </div>\n<p>For those who are intersted, <a href="https://github.com/richardimaoka/resources/blob/master/akka-http-cassandra/src/main/scala/example/HttpNoPersistentServer.scala">the full HttpServer code</a> is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">import</span> java<span class="token punctuation">.</span>io<span class="token punctuation">.</span><span class="token punctuation">{</span>PrintWriter<span class="token punctuation">,</span> StringWriter<span class="token punctuation">}</span>\n\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>actor<span class="token punctuation">.</span>ActorSystem\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>Http\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>http<span class="token punctuation">.</span>scaladsl<span class="token punctuation">.</span>server<span class="token punctuation">.</span><span class="token punctuation">{</span>Directives<span class="token punctuation">,</span> Route<span class="token punctuation">}</span>\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>ActorMaterializer\n<span class="token keyword">import</span> akka<span class="token punctuation">.</span>util<span class="token punctuation">.</span>Timeout\n\n<span class="token keyword">import</span> scala<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>Await\n<span class="token keyword">import</span> scala<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>duration<span class="token punctuation">.</span>_\n\n<span class="token keyword">object</span> HttpNoPersistentServer <span class="token keyword">extends</span> Directives <span class="token punctuation">{</span>\n  <span class="token keyword">def</span> main<span class="token punctuation">(</span>args<span class="token operator">:</span> Array<span class="token punctuation">[</span><span class="token builtin">String</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">import</span> ScoringJsonSupport<span class="token punctuation">.</span>_\n\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> system<span class="token operator">:</span> ActorSystem <span class="token operator">=</span> ActorSystem<span class="token punctuation">(</span><span class="token string">"HttpNoPersistentServer"</span><span class="token punctuation">)</span>\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> materializer<span class="token operator">:</span> ActorMaterializer <span class="token operator">=</span> ActorMaterializer<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n    <span class="token keyword">implicit</span> <span class="token keyword">val</span> timeout<span class="token operator">:</span> Timeout <span class="token operator">=</span> <span class="token number">3.</span>seconds\n\n    <span class="token keyword">var</span> averageScore<span class="token operator">:</span> <span class="token builtin">Double</span> <span class="token operator">=</span> <span class="token number">0</span>\n    <span class="token keyword">var</span> totalScore<span class="token operator">:</span>   <span class="token builtin">Double</span> <span class="token operator">=</span> <span class="token number">0</span>\n    <span class="token keyword">var</span> numberOfTrials<span class="token operator">:</span> <span class="token builtin">Long</span> <span class="token operator">=</span> <span class="token number">0</span>\n\n    <span class="token keyword">def</span> updateState<span class="token punctuation">(</span>score<span class="token operator">:</span> <span class="token builtin">Double</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span><span class="token punctuation">{</span>\n      totalScore <span class="token operator">=</span> totalScore <span class="token operator">+</span> score\n      numberOfTrials <span class="token operator">=</span> numberOfTrials <span class="token operator">+</span> <span class="token number">1</span>\n      averageScore <span class="token operator">=</span> totalScore <span class="token operator">/</span> numberOfTrials\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n      <span class="token keyword">val</span> routes<span class="token operator">:</span> Route <span class="token operator">=</span>\n        path<span class="token punctuation">(</span><span class="token string">"scoring"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          post <span class="token punctuation">{</span>\n            entity<span class="token punctuation">(</span>as<span class="token punctuation">[</span>ScoringRequest<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> request <span class="token keyword">=></span>\n              updateState<span class="token punctuation">(</span>request<span class="token punctuation">.</span>score<span class="token punctuation">)</span>\n              complete <span class="token punctuation">{</span>\n                ScoreResponse<span class="token punctuation">(</span>averageScore<span class="token punctuation">,</span> totalScore<span class="token punctuation">,</span> numberOfTrials<span class="token punctuation">)</span>\n              <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n\n      Http<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>bindAndHandle<span class="token punctuation">(</span>routes<span class="token punctuation">,</span> <span class="token string">"localhost"</span><span class="token punctuation">,</span> <span class="token number">8095</span><span class="token punctuation">)</span>\n      println<span class="token punctuation">(</span>s<span class="token string">"Server online at http://localhost:8095/"</span><span class="token punctuation">)</span>\n      Await<span class="token punctuation">.</span>result<span class="token punctuation">(</span>system<span class="token punctuation">.</span>whenTerminated<span class="token punctuation">,</span> Duration<span class="token punctuation">.</span>Inf<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">{</span>\n      <span class="token keyword">case</span> t<span class="token operator">:</span> Throwable <span class="token keyword">=></span>\n        <span class="token keyword">val</span> sw <span class="token operator">=</span> <span class="token keyword">new</span> StringWriter\n        t<span class="token punctuation">.</span>printStackTrace<span class="token punctuation">(</span><span class="token keyword">new</span> PrintWriter<span class="token punctuation">(</span>sw<span class="token punctuation">)</span><span class="token punctuation">)</span>\n        println<span class="token punctuation">(</span>t<span class="token punctuation">.</span>getMessage<span class="token punctuation">)</span>\n        println<span class="token punctuation">(</span>sw<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p><a href="https://github.com/wg/wrk/issues/267">To send a JSON request by wrk</a>, you need to write a lua script like this: </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">wrk.method = &quot;POST&quot;\nwrk.body   = &#39;{&quot;score&quot;: 10}&#39;\nwrk.headers[&quot;Content-Type&quot;] = &quot;application/json&quot;</code></pre>\n      </div>\n<p>I saved it as <code class="language-text">wrk-script.lua</code>, and ran the following command:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">$ wrk -t2 -c100 -d30s  -s wrk-script.lua http://localhost:8095/scoring</code></pre>\n      </div>\n<p>The results were already pasted at the beginning of this article.</p>\n<h2>2. In-Memory persistence</h2>\n<p><img src="/blog/in-memory-f620aaeb90877b05fd3d23a9ac44a0a8.jpg" alt="in-memory"></p>\n<p>Now I’m adding persistence to the system, but before doing it with Cassandra, I’m using in-memory persistence. The persistent actor code is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">class</span> ScoringActor <span class="token keyword">extends</span> PersistentActor <span class="token punctuation">{</span>\n  <span class="token keyword">import</span> ScoringActor<span class="token punctuation">.</span>_\n\n  <span class="token keyword">var</span> averageScore<span class="token operator">:</span> <span class="token builtin">Double</span> <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">var</span> totalScore<span class="token operator">:</span>   <span class="token builtin">Double</span> <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">var</span> numberOfTrials<span class="token operator">:</span> <span class="token builtin">Long</span> <span class="token operator">=</span> <span class="token number">0</span>\n\n  <span class="token keyword">def</span> persistenceId <span class="token operator">=</span> <span class="token string">"scoring"</span>\n\n  <span class="token keyword">def</span> updateState<span class="token punctuation">(</span>score<span class="token operator">:</span> <span class="token builtin">Double</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Unit</span> <span class="token operator">=</span><span class="token punctuation">{</span>\n    totalScore <span class="token operator">=</span> totalScore <span class="token operator">+</span> score\n    numberOfTrials <span class="token operator">=</span> numberOfTrials <span class="token operator">+</span> <span class="token number">1</span>\n    averageScore <span class="token operator">=</span> totalScore <span class="token operator">/</span> numberOfTrials\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">def</span> receiveCommand <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> ScoringCommand<span class="token punctuation">(</span>score<span class="token punctuation">)</span> <span class="token keyword">=></span>\n      <span class="token keyword">val</span> _sender <span class="token operator">=</span> sender<span class="token punctuation">(</span><span class="token punctuation">)</span>\n      persist<span class="token punctuation">(</span>ScoringEvent<span class="token punctuation">(</span>score<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        evt <span class="token keyword">=></span> updateState<span class="token punctuation">(</span>evt<span class="token punctuation">.</span>score<span class="token punctuation">)</span>\n          _sender <span class="token operator">!</span> ScoreResponse<span class="token punctuation">(</span>\n            averageScore<span class="token punctuation">,</span>\n            totalScore<span class="token punctuation">,</span>\n            numberOfTrials\n          <span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">override</span> <span class="token keyword">def</span> receiveRecover <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> evt<span class="token operator">:</span> ScoringEvent <span class="token keyword">=></span>\n      updateState<span class="token punctuation">(</span>evt<span class="token punctuation">.</span>score<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">object</span> ScoringActor <span class="token punctuation">{</span>\n  <span class="token keyword">case</span> <span class="token keyword">class</span> ScoringCommand<span class="token punctuation">(</span>score<span class="token operator">:</span> <span class="token builtin">Double</span><span class="token punctuation">)</span>\n  <span class="token keyword">case</span> <span class="token keyword">class</span> ScoringEvent<span class="token punctuation">(</span>score<span class="token operator">:</span> <span class="token builtin">Double</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>The HttpServer code needs to instantiate the persistent actor (<code class="language-text">ScoringActor</code>) and do <code class="language-text">scoringActor ? ScoringCommand(request.score)</code> to perform persistence.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">import</span> ScoringJsonSupport<span class="token punctuation">.</span>_\n\n<span class="token keyword">implicit</span> <span class="token keyword">val</span> system<span class="token operator">:</span> ActorSystem <span class="token operator">=</span> ActorSystem<span class="token punctuation">(</span><span class="token string">"HttpPersistentServer"</span><span class="token punctuation">)</span>\n<span class="token keyword">implicit</span> <span class="token keyword">val</span> materializer<span class="token operator">:</span> ActorMaterializer <span class="token operator">=</span> ActorMaterializer<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">val</span> scoringActor <span class="token operator">=</span> system<span class="token punctuation">.</span>actorOf<span class="token punctuation">(</span>Props<span class="token punctuation">[</span>ScoringActor<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">"scoring"</span><span class="token punctuation">)</span>\n\n<span class="token keyword">implicit</span> <span class="token keyword">val</span> timeout<span class="token operator">:</span> Timeout <span class="token operator">=</span> <span class="token number">3.</span>seconds\n\n<span class="token keyword">val</span> routes<span class="token operator">:</span> Route <span class="token operator">=</span>\n  path<span class="token punctuation">(</span><span class="token string">"scoring"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    post <span class="token punctuation">{</span>\n      entity<span class="token punctuation">(</span>as<span class="token punctuation">[</span>ScoringRequest<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> request <span class="token keyword">=></span>\n        complete <span class="token punctuation">{</span>\n          <span class="token punctuation">(</span>scoringActor <span class="token operator">?</span> ScoringCommand<span class="token punctuation">(</span>request<span class="token punctuation">.</span>score<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mapTo<span class="token punctuation">[</span>ScoreResponse<span class="token punctuation">]</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>    </code></pre>\n      </div>\n<p>here is <code class="language-text">application.conf</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">akka {\n  loggers = [&quot;akka.event.slf4j.Slf4jLogger&quot;]\n\n  persistence {\n    journal {\n      plugin = &quot;akka.persistence.journal.inmem&quot;\n    }\n    snapshot-store {\n      plugin = &quot;akka.persistence.snapshot-store.local&quot;\n    }\n  }\n}</code></pre>\n      </div>\n<p>As in the results we saw earlier, it became slower than 1. JSON marshalling/unmarshalling, because there is communication between the server and the persistent actor. However, the persistent <strong>actor</strong> itself is still lightweight, compared to the actual persistence to Cassandra which I’ll explain next.</p>\n<h2>3. Persistence to Cassandra</h2>\n<p><img src="/blog/cassandra-8529bc064b866354443cb375e34bc1f6.jpg" alt="cassandra"></p>\n<p>Finally we do real persistence. application.conf becomes this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">akka {\n  loggers = [&quot;akka.event.slf4j.Slf4jLogger&quot;]\n\n  persistence {\n    journal {\n      plugin = &quot;cassandra-journal&quot;\n    }\n    snapshot-store {\n      plugin = &quot;cassandra-snapshot-store&quot;\n    }\n  }\n}</code></pre>\n      </div>\n<p>And you would also need this logback.xml otherwise the log is filled up by a lot of DEBUG level messages from the Cassandra library.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">&amp;ltconfiguration&amp;gt\n    &amp;ltappender name=&quot;STDOUT&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&amp;gt\n        &amp;lt!-- encoders are assigned the type\n             ch.qos.logback.classic.encoder.PatternLayoutEncoder by default --&amp;gt\n        &amp;ltencoder&amp;gt\n            &amp;ltpattern&amp;gt%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n&amp;lt/pattern&amp;gt\n        &amp;lt/encoder&amp;gt\n    &amp;lt/appender&amp;gt\n\n    &amp;ltlogger name=&quot;com.datastax.driver.core.Connection&quot;  level=&quot;WARN&quot; additivity=&quot;false&quot; /&amp;gt\n    &amp;ltlogger name=&quot;com.datastax.driver&quot;                  level=&quot;WARN&quot; additivity=&quot;false&quot; /&amp;gt\n\n    &amp;ltroot level=&quot;INFO&quot;&amp;gt\n        &amp;ltappender-ref ref=&quot;STDOUT&quot; /&amp;gt\n    &amp;lt/root&amp;gt\n&amp;lt/configuration&amp;gt</code></pre>\n      </div>\n<p>No need to change the Scala code.</p>\n<h2>Lessons learned</h2>\n<p>Even before conducting the benchmark, we could have guessed that Cassandra would be the bottleneck of the system, as database I/O is typically the performance bottleneck of a web applicaiton system.</p>\n<p>However, <strong>to know how much the difference is</strong>, experiment is necessary. So I went through the process on how to distinguish the performance overhead of a single component from all the other , and you can apply the same technique to analyze any component in your system.</p>\n<p>Next step, I want to dockerize this performance experiment environment so that we can run it in the cloud. Also later on I want to Kubernet-ize this and hopefully the deployment and running of the performance test is just a breeze!!</p>\n<p>It’s getting interesting to me :)</p>\n<h2>References</h2>\n<ul>\n<li>Marshalling and Unmarshalling in Akka HTTP at - <a href="https://doc.akka.io/docs/akka-http/2.5/common/marshalling.html#marshalling">https://doc.akka.io/docs/akka-http/2.5/common/marshalling.html#marshalling</a></li>\n<li>Persistent actor at - <a href="https://doc.akka.io/docs/akka/2.5/persistence.html">https://doc.akka.io/docs/akka/2.5/persistence.html</a></li>\n<li>akka-cassandra at <a href="https://github.com/akka/akka-persistence-cassandra">https://github.com/akka/akka-persistence-cassandra</a></li>\n</ul>',frontmatter:{title:"Locally Benchmarking Akka HTTP with akka-persistence-cassandra",date:"March 11, 2018"}}},pathContext:{slug:"/benchmarking-akka-http-cassandra-local/"}}}});
//# sourceMappingURL=path---benchmarking-akka-http-cassandra-local-b285dfe4865738da449e.js.map