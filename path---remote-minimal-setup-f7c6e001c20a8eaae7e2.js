webpackJsonp([74705494097707],{535:function(e,t){e.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/remote-minimal-setup.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p>You can find the code and instruction to run the example at <a href="https://github.com/richardimaoka/resources/tree/master/remote-minimal">GitHub</a>.</p>\n<div>\n          <div\n            class="gatsby-resp-iframe-wrapper"\n            style="padding-bottom: 56.25%; position: relative; height: 0; overflow: hidden;margin-bottom: 1.0725rem"\n          >\n            <iframe src="https://www.youtube.com/embed/YYGQYSpoBhE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          "></iframe>\n          </div>\n          </div>\n<p><a href="../remote-minimal-sender">The next article</a> explains how this remoting example works on the sender side.</p>\n<h2>Instruction to run the example, and output</h2>\n<p>As this example uses <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">Akka remoting</a> to send a message,\nyou need to run two JVMs for the receiver and sender of the application respectively.</p>\n<p>Firstly, run the receiver side with the <code>receiver</code> argument supplied to <code>Main</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> git clone https://github.com/richardimaoka/resources.git\n> cd resources\n> cd remote-minimal\n> sbt\n> runMain example.Main receiver</code></pre>\n      </div>\n<p>You’ll get output like below, then it waits until the message is sent from the sender.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> runMain example.Main receiver\n[info] Running example.Main receiver\nProgram args:\nreceiver\nrunning startMessageReceiver()\n[INFO] [02/03/2018 13:36:58.281] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:36:58.462] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://receiverSystem@127.0.0.1:2551]\n[INFO] [02/03/2018 13:36:58.464] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://receiverSystem@127.0.0.1:2551]\nprovider = remote\nlistening at port = 2551\nstarted a receiver actor = Actor[akka://receiverSystem/user/receiver#-603875191]</code></pre>\n      </div>\n<p>Then in the same directory, run the same <code>Main</code> with <code>sender</code> as the argument</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>> sbt\n> runMain example.Main sender</code></pre>\n      </div>\n<p>this is the sender side output:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[info] Running example.Main sender\nProgram args:\nsender\nrunning startMessageSender()\n[INFO] [02/03/2018 13:37:16.215] [run-main-0] [akka.remote.Remoting] Starting remoting\n[INFO] [02/03/2018 13:37:16.427] [run-main-0] [akka.remote.Remoting] Remoting started; listening on addresses :[akka.tcp://senderSystem@127.0.0.1:2552]\n[INFO] [02/03/2018 13:37:16.432] [run-main-0] [akka.remote.Remoting] Remoting now listens on addresses: [akka.tcp://senderSystem@127.0.0.1:2552]\nprovider = remote\nlistening at port = 2552\nsending a message to akka.tcp://receiverSystem@127.0.0.1:2551/user/receiver\n[INFO] [02/03/2018 13:37:19.533] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:37:19.537] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.actor.default-dispatcher-4] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:37:19.577] [senderSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://senderSystem@127.0.0.1:2552/system/remoting-terminator] Remoting shut down.\n[success] Total time: 5 s, completed Feb 3, 2018 1:37:19 PM</code></pre>\n      </div>\n<p>then you see the receiver output as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>EchoActor: received message = Hello!!</code></pre>\n      </div>\n<p>and immediately after that, the receiver side shows this error, which can be ignored.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[ERROR] [02/03/2018 13:37:19.572] [receiverSystem-akka.remote.default-remote-dispatcher-15] [akka.tcp://receiverSystem@127.0.0.1:2551/system/endpointManager/reliableEndpointWriter-akka.tcp%3A%2F%2FsenderSystem%40127.0.0.1%3A2552-0/endpointWriter] AssociationError [akka.tcp://receiverSystem@127.0.0.1:2551] <- [akka.tcp://senderSystem@127.0.0.1:2552]: Error [Shut down address: akka.tcp://senderSystem@127.0.0.1:2552] [\nakka.remote.ShutDownAssociation: Shut down address: akka.tcp://senderSystem@127.0.0.1:2552\nCaused by: akka.remote.transport.Transport$InvalidAssociationException: The remote system terminated the association because it is shutting down.\n]</code></pre>\n      </div>\n<p>As explained in <a href="https://groups.google.com/forum/#!topic/akka-user/eerWNwRQ7o0">this thrad in akka-user</a> mailing list, the error happens specifically when you launch a process like this example from sbt, but when you compile your application and run it witout sbt, then the error disappears.</p>\n<p>Once everything is done, press the enter key on the receiver side’s console and you get this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>[INFO] [02/03/2018 13:38:05.942] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Shutting down remote daemon.\n[INFO] [02/03/2018 13:38:05.944] [receiverSystem-akka.remote.default-remote-dispatcher-5] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remote daemon shut down; proceeding with flushing remote transports.\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.actor.default-dispatcher-3] [akka.remote.Remoting] Remoting shut down\n[INFO] [02/03/2018 13:38:05.960] [receiverSystem-akka.remote.default-remote-dispatcher-6] [akka.tcp://receiverSystem@127.0.0.1:2551/system/remoting-terminator] Remoting shut down.</code></pre>\n      </div>\n<h2>References</h2>\n<ul>\n<li>Official documentation at <a href="https://doc.akka.io/docs/akka/2.5/remoting.html">https://doc.akka.io/docs/akka/2.5/remoting.html</a></li>\n</ul>',frontmatter:{title:"Akka remoting minimal example part 1 - setup",date:"February 02, 2018"}}},pathContext:{slug:"/remote-minimal-setup/"}}}});
//# sourceMappingURL=path---remote-minimal-setup-f7c6e001c20a8eaae7e2.js.map