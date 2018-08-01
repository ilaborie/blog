webpackJsonp([30359656437026],{421:function(e,t){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/akka-http-tcp-streaming/index.md absPath of file >>> MarkdownRemark",html:'<p>Akka HTTP server is implemented in using streams, all the way from the TCP layer through the HTTP layer, up to your application layer. In this short article, I am going to cover how TCP streaming works in Akka HTTP.</p>\n<p><img src="/blog/TCP-streaming-0235c7653c929221a95b9b1bc26e766d.gif" alt="TCP-streaming"></p>\n<p>The above animation illustrates streaming at the TCP layer. Firstly, each incoming connection, triggers a creation of <code class="language-text">Tcp.IncomingConnection</code> which essentially represents <code class="language-text">Flow[ByteString, ByteString]</code> in Akka Streams. And within each TCP connection, data bytes in <code class="language-text">ByteString</code> are streamed through the connection.</p>\n<p>Then TCP data bytes in <code class="language-text">ByteString</code> are converted to/from higher level data models, <code class="language-text">HttpRequest</code>/<code class="language-text">HttpResponse</code> but that will be discussed in a separate article.</p>\n<h2>Handling many connections with fewer threads</h2>\n<p>By design, Akka HTTP does not need to hold a dedicated thread for each TCP connection. To see this in action, let me do some experiment. I used an HTTP benchmark client <a href="https://github.com/wg/wrk">wrk</a>, which is known as a minimal and lightning fast HTTP benchmark client. I wanted to quickly and easily “hammer” Akka HTTP so chose wrk.</p>\n<p>I executed the following wrk command:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">$ wrk -t6 -c1200  -d30s http://localhost:8080</code></pre>\n      </div>\n<p>which meant:</p>\n<ul>\n<li><code class="language-text">-t6 : it uses 6 benchmark client threads</code>,</li>\n<li><code class="language-text">-c1200: 1,200 open connections</code> and</li>\n<li><code class="language-text">-d30s: runs benchmark for 30 seconds</code>.</li>\n</ul>\n<p>I chose 1200 connections because, by default, Akka HTTP accepts up to 1024 open TCP connections, and the limit can be configured by the <code class="language-text">akka.http.host-connection-pool.max-connections</code> config value. 1200 is little more than the default max connections.</p>\n<p>The result is here, where I shortend the vide duration a bit from 30 seconds.</p>\n<p><img src="/blog/wrk-test-2fad332d59bfe643cf05334cf6ce91c1.gif" alt="wrk-test"></p>\n<p>I forcefully inserted <code class="language-text">println</code> so show the active TCP connections and it says it opened 1016, not 1024. This was due to some connections errors, and indeed errors were included in the below result. Maybe wrk was too fast (indeed, it is super fast!) and caused connection failure.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">Running 30s test @ http://localhost:8080\n\n  6 threads and 1200 connections\n  Thread Stats   Avg      Stdev     Max   +/- Stdev\n    Latency    20.42ms   10.49ms 484.06ms   95.94%\n    Req/Sec     7.92k     1.57k   11.90k    91.37%\n\n  1400416 requests in 30.04s, 205.67MB read\n  Socket errors: connect 185, read 0, write 649, timeout 0\n\nRequests/sec:  46619.78\nTransfer/sec:      6.85MB</code></pre>\n      </div>\n<p>Anyway, see the below screenshot of VisualVM. Main-akka.actor.default-dispatcher-XX are threads serving underlying actors for Akka HTTP. There were only about 30 threads, although the HTTP server had more than 1000 connections open at the time.</p>\n<p><img src="/blog/visual-vm-d53958439b5af189947957ff9b7e5de8.png" alt="visual-vm.png"></p>',frontmatter:{title:"Akka HTTP and TCP streaming",date:"July 26, 2018"}}},pathContext:{slug:"/akka-http-tcp-streaming/"}}}});
//# sourceMappingURL=path---akka-http-tcp-streaming-b774278dd2be681992ef.js.map