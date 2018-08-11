webpackJsonp([0xc9353b29d726],{445:function(a,n){a.exports={data:{site:{siteMetadata:{title:"Akka, Concurrency, etc.",author:"Richard Imaoka"}},markdownRemark:{id:"C:/Users/richardimaoka/blog/src/pages/swagger-akka-http/index.md absPath of file >>> MarkdownRemark",html:'<h2>Overview</h2>\n<p><strong>TL;DR)</strong> You can use Swagger with Akka HTTP and get some benefit from Swagger, but the workflow is not fully automated with existing tools.</p>\n<p>Recently I did some personal survey on how Swagger can be integrated with Akka HTTP. Before the survey, I was expeciting automation just works like:</p>\n<ol>\n<li>\n<p>Swagger spec file can generate Akka HTTP server code</p>\n</li>\n<li>\n<p>or <code class="language-text">@Annotations</code> in the server code generate the Swagger specification</p>\n</li>\n</ol>\n<p>but there are limitations to both 1) and 2), which I will explain later in the article.</p>\n<h2>Top-down and bottom-up approaches</h2>\n<p>Let me firstly introduce so-called top-down and bottom-up approaches in terms of how to use Swagger, which is also explained in the official <a href="https://swagger.io/getting-started/">getting started guide</a>.</p>\n<blockquote>\n<p>A top-down approach where you would use the Swagger Editor to create your Swagger definition and then use the integrated Swagger Codegen tools to generate server implementation.</p>\n</blockquote>\n<blockquote>\n<p>A bottom-up approach where you have an existing REST API for which you want to create a Swagger definition</p>\n</blockquote>\n<p><a href="https://editor.swagger.io/">Swagger Editor</a> is a browser based tool for editing the swagger specification file in json or yaml. For <a href="https://github.com/swagger-api/swagger-codegen">Swagger codegen</a>, it already officially supports a bunch of languages and frameworks,</p>\n<p><img src="/blog/swagger-codegen-support-2007b8af3c0adcf09ab7c7b904f615ed.png" alt="swagger-codege-support"></p>\n<p> and also a lot of community plugins available for other frameworks.</p>\n<h3>When to use which approach?</h3>\n<p>The top-down approach is suitable when:</p>\n<ul>\n<li>you have an automatic tool to generate the server-side code</li>\n<li>or you are developing a brand new API-based service, and the client wants to start development without waiting for the server side implementation ready</li>\n</ul>\n<p>When talking about automatic generation of the server side implementation, tools usually don’t produce fully detailed implementation, but they generates interfaces (in Scala, it would be traits) which you can extend to hook up detailed behaivor implementation in a later phase.</p>\n<p>On the other hand, the bottom-up approach would be suitable when:</p>\n<ul>\n<li>a Swagger spec-gen tool is avaialble from the server side code</li>\n<li>or you already have the server side implementation, and want to start using Swagger for better API management, and leverage the Swagger toolset</li>\n<li>even for a brand new API service, if you can quickly write up a server mock to generate the Swagger spec file, or manually write down Swagger spec until the server impelentation is ready, bottom-up is useful</li>\n</ul>\n<p>In both cases, the automated server-code or spec-file generation tool is very important, to make sure there is only one source of truth and the other generated side is compliant with the original. If the automated tool is not avaialble, no matter whether it is for the top-down or bottom-up approach, you need a lot more effort to make sure the server implementation is compliant with the API. </p>\n<p>Probably you can leverage the swagger specification file to generate automated test cases, which helps you to make sure the specification and the server implementatin are in sync, but it is still much better to have an auto-gen tool for either the spec file or the server implementation.</p>\n<h2>The current status of Akka HTTP and Swagger integration</h2>\n<p><a href="https://github.com/swagger-akka-http/swagger-akka-http">swagger-akka-http</a> already exists and this is for the bottom-up approach, which will generate the specification from <code class="language-text">@Annotation</code>s in the Akka HTTP server-side code.</p>\n<p>No top-down auto-generation tool is avaialble for Akka HTTP, or at least no such tool is widely used.</p>\n<p>To see how swagger-akka-http works, I did some experiment - I tried to generate the same specification as <a href="http://petstore.swagger.io/">the official Swagger PetStore sample</a> from the server <code class="language-text">@Annotation</code>. Looking at the sample, the top section of the spec can be generated by the following <code class="language-text">SwaggerDocService</code> implementation.  </p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">import</span> com<span class="token punctuation">.</span>github<span class="token punctuation">.</span>swagger<span class="token punctuation">.</span>akka<span class="token punctuation">.</span>SwaggerHttpService\n<span class="token keyword">import</span> com<span class="token punctuation">.</span>github<span class="token punctuation">.</span>swagger<span class="token punctuation">.</span>akka<span class="token punctuation">.</span>model<span class="token punctuation">.</span>_\n<span class="token keyword">import</span> example<span class="token punctuation">.</span>endpoints<span class="token punctuation">.</span>PetEndPoint\n<span class="token keyword">import</span> io<span class="token punctuation">.</span>swagger<span class="token punctuation">.</span>models<span class="token punctuation">.</span>ExternalDocs\n<span class="token keyword">import</span> io<span class="token punctuation">.</span>swagger<span class="token punctuation">.</span>models<span class="token punctuation">.</span>auth<span class="token punctuation">.</span><span class="token punctuation">{</span>ApiKeyAuthDefinition<span class="token punctuation">,</span> In<span class="token punctuation">,</span> OAuth2Definition<span class="token punctuation">}</span>\n\n<span class="token keyword">object</span> SwaggerDocService <span class="token keyword">extends</span> SwaggerHttpService <span class="token punctuation">{</span>\n  <span class="token keyword">override</span> <span class="token keyword">val</span> apiClasses <span class="token operator">=</span> Set<span class="token punctuation">(</span>classOf<span class="token punctuation">[</span>PetEndPoint<span class="token punctuation">]</span><span class="token punctuation">)</span>\n  <span class="token keyword">override</span> <span class="token keyword">val</span> host <span class="token operator">=</span> <span class="token string">"localhost:9999"</span>\n  <span class="token keyword">override</span> <span class="token keyword">val</span> basePath <span class="token operator">=</span> <span class="token string">"v2"</span>\n  <span class="token keyword">override</span> <span class="token keyword">val</span> info <span class="token operator">=</span> Info<span class="token punctuation">(</span>\n    version <span class="token operator">=</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>\n    description <span class="token operator">=</span>\n      <span class="token string">"""This is a sample server Petstore server.  You can find out more about\n        |Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).\n        |For this sample, you can use the api key `special-key` to test the authorization filters."\n      """</span><span class="token punctuation">.</span>stripMargin<span class="token punctuation">,</span>\n    title <span class="token operator">=</span> <span class="token string">"Swagger Petstore"</span><span class="token punctuation">,</span>\n    termsOfService <span class="token operator">=</span> <span class="token string">"http://swagger.io/terms/"</span><span class="token punctuation">,</span>\n    contact <span class="token operator">=</span> Some<span class="token punctuation">(</span>Contact<span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">,</span><span class="token string">""</span><span class="token punctuation">,</span><span class="token string">"apiteam@swagger.io"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    license <span class="token operator">=</span> Some<span class="token punctuation">(</span>License<span class="token punctuation">(</span><span class="token string">"Apache 2.0"</span><span class="token punctuation">,</span> <span class="token string">"http://www.apache.org/licenses/LICENSE-2.0.html"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">)</span>\n  <span class="token keyword">override</span> <span class="token keyword">val</span> externalDocs <span class="token operator">=</span> Some<span class="token punctuation">(</span><span class="token keyword">new</span> ExternalDocs<span class="token punctuation">(</span><span class="token string">"Core Docs"</span><span class="token punctuation">,</span> <span class="token string">"http://acme.com/docs"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">private</span> <span class="token keyword">val</span> oAuth2Definition <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">new</span> OAuth2Definition<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span>scope<span class="token punctuation">(</span><span class="token string">"write:pets"</span><span class="token punctuation">,</span> <span class="token string">"modify pets in your account"</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span>scope<span class="token punctuation">(</span><span class="token string">"read:pets"</span><span class="token punctuation">,</span> <span class="token string">"read your pets"</span><span class="token punctuation">)</span>\n\n  oAuth2Definition<span class="token punctuation">.</span>setAuthorizationUrl<span class="token punctuation">(</span><span class="token string">"http://petstore.swagger.io/oauth/dialog"</span><span class="token punctuation">)</span>\n  oAuth2Definition<span class="token punctuation">.</span>setFlow<span class="token punctuation">(</span><span class="token string">"implicit"</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">override</span> <span class="token keyword">val</span> securitySchemeDefinitions <span class="token operator">=</span> Map<span class="token punctuation">(</span>\n    <span class="token string">"petsotre_auth"</span> <span class="token operator">-</span><span class="token operator">></span> oAuth2Definition<span class="token punctuation">,</span>\n    <span class="token string">"api_key"</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token keyword">new</span> ApiKeyAuthDefinition<span class="token punctuation">(</span><span class="token string">"api_key"</span><span class="token punctuation">,</span> In<span class="token punctuation">.</span>HEADER<span class="token punctuation">)</span>\n  <span class="token punctuation">)</span>\n  <span class="token keyword">override</span> <span class="token keyword">val</span> unwantedDefinitions <span class="token operator">=</span> Seq<span class="token punctuation">(</span><span class="token string">"Function1"</span><span class="token punctuation">,</span> <span class="token string">"Function1RequestContextFutureRouteResult"</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Interestingly, in swagger-akka-http, you extend this <code class="language-text">SwaggerHttpService</code> to supply application-wide information, instead of using <a href="https://github.com/swagger-api/swagger-core/wiki/annotations-1.5.x#swaggerdefinition"><code class="language-text">@SwaggerDefinition</code></a> annotation like other Java frameworks.</p>\n<p>The generated schema is this (I will explain how to generate the spec later): </p>\n<div class="gatsby-highlight">\n      <pre class="language-yaml"><code class="language-yaml"><span class="token key atrule">swagger</span><span class="token punctuation">:</span> <span class="token string">"2.0"</span>\n<span class="token key atrule">info</span><span class="token punctuation">:</span>\n  <span class="token key atrule">description</span><span class="token punctuation">:</span> "This is a sample server Petstore server.  You can find out more about\\r\\\n    \\nSwagger at <span class="token punctuation">[</span>http<span class="token punctuation">:</span>//swagger.io<span class="token punctuation">]</span>(http<span class="token punctuation">:</span>//swagger.io) or on <span class="token punctuation">[</span>irc.freenode.net<span class="token punctuation">,</span> <span class="token comment">#swagger](http://swagger.io/irc/).\\r\\</span>\n    \\nFor this sample<span class="token punctuation">,</span> you can use the api key `special<span class="token punctuation">-</span>key` to test the authorization\\\n    \\ filters.\\"\\r\\n      "\n  <span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"1.0.0"</span>\n  <span class="token key atrule">title</span><span class="token punctuation">:</span> <span class="token string">"Swagger Petstore"</span>\n  <span class="token key atrule">termsOfService</span><span class="token punctuation">:</span> <span class="token string">"http://swagger.io/terms/"</span>\n  <span class="token key atrule">contact</span><span class="token punctuation">:</span>\n    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">""</span>\n    <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">""</span>\n    <span class="token key atrule">email</span><span class="token punctuation">:</span> <span class="token string">"apiteam@swagger.io"</span>\n  <span class="token key atrule">license</span><span class="token punctuation">:</span>\n    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Apache 2.0"</span>\n    <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">"http://www.apache.org/licenses/LICENSE-2.0.html"</span>\n<span class="token key atrule">host</span><span class="token punctuation">:</span> <span class="token string">"localhost:9939"</span>\n<span class="token key atrule">basePath</span><span class="token punctuation">:</span> <span class="token string">"/v2"</span>\n<span class="token key atrule">tags</span><span class="token punctuation">:</span>\n<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"pet"</span>\n<span class="token key atrule">schemes</span><span class="token punctuation">:</span>\n<span class="token punctuation">-</span> <span class="token string">"http"</span></code></pre>\n      </div>\n<p>which is (almost) same as that of <a href="https://editor.swagger.io/">the Petstore sample</a> I modeled after. </p>\n<p><img src="/blog/Swagger-Editor-top-a2fd782f8ad497ebbaea89130d00e889.png" alt="Sawgger-Editor-top"></p>\n<p>Next, look at the <code class="language-text">pet</code> endpoint. This is how the sample PetStore specification looks when you load it in Swagger Editor.</p>\n<p><img src="/blog/Swagger-Editor-pet-d26ec67ac1ceac1eea450f034c10995b.png" alt="Sawgger-Editor-pet"></p>\n<p>To get the same spec as above, you need these annotations to be added at the class or trait level to give information across different HTTP methods, <code class="language-text">POST</code>, <code class="language-text">GET</code>, <code class="language-text">PUT</code>, <code class="language-text">PATCH</code> and <code class="language-text">DELETE</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token annotation punctuation">@Api</span><span class="token punctuation">(</span>\n  value <span class="token operator">=</span> <span class="token string">"/pet"</span><span class="token punctuation">,</span> <span class="token comment">//tags in endpoint</span>\n  consumes <span class="token operator">=</span> <span class="token string">"application/json, application/xml"</span><span class="token punctuation">,</span>\n  produces <span class="token operator">=</span> <span class="token string">"application/json, application/xml"</span>\n<span class="token punctuation">)</span>\n<span class="token annotation punctuation">@Path</span><span class="token punctuation">(</span><span class="token string">"/pet"</span><span class="token punctuation">)</span>\n<span class="token keyword">trait</span> PetEndPoint <span class="token keyword">extends</span> Directives <span class="token keyword">with</span> DefaultJsonFormats <span class="token punctuation">{</span>\n  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>and for each HTTP method, you typically add a method in the trait like this … ugh it is really a lot of verbose <code class="language-text">@Annotation</code>’s to explain this single HTTP <code class="language-text">POST</code> method!!</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala">  <span class="token annotation punctuation">@ApiOperation</span><span class="token punctuation">(</span>\n    value <span class="token operator">=</span> <span class="token string">"Add a new pet to the store"</span><span class="token punctuation">,</span>\n    nickname <span class="token comment">/*operationId*/</span><span class="token operator">=</span> <span class="token string">"addPet"</span><span class="token punctuation">,</span>\n    httpMethod <span class="token operator">=</span> <span class="token string">"POST"</span><span class="token punctuation">,</span>\n    response <span class="token operator">=</span> classOf<span class="token punctuation">[</span>Pet<span class="token punctuation">]</span><span class="token punctuation">,</span>\n    authorizations <span class="token operator">=</span> Array<span class="token punctuation">(</span>\n      <span class="token keyword">new</span> Authorization<span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"petstore_auth"</span><span class="token punctuation">,</span> scopes <span class="token operator">=</span> Array<span class="token punctuation">(</span>\n          <span class="token keyword">new</span> AuthorizationScope<span class="token punctuation">(</span>scope <span class="token operator">=</span><span class="token string">"write:pets"</span><span class="token punctuation">,</span> description <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n          <span class="token keyword">new</span> AuthorizationScope<span class="token punctuation">(</span>scope <span class="token operator">=</span><span class="token string">"read:pets"</span><span class="token punctuation">,</span>  description <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n        <span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span>\n  <span class="token annotation punctuation">@ApiImplicitParams</span><span class="token punctuation">(</span>Array<span class="token punctuation">(</span>\n    <span class="token keyword">new</span> ApiImplicitParam<span class="token punctuation">(</span>\n      name <span class="token operator">=</span> <span class="token string">"body"</span><span class="token punctuation">,</span>\n      paramType <span class="token operator">=</span> <span class="token string">"body"</span><span class="token punctuation">,</span>\n      value <span class="token operator">=</span> <span class="token string">"Pet object that needs to be added to the store"</span><span class="token punctuation">,</span>\n      required <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      dataTypeClass <span class="token operator">=</span> classOf<span class="token punctuation">[</span>Pet<span class="token punctuation">]</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token annotation punctuation">@ApiResponses</span><span class="token punctuation">(</span>Array<span class="token punctuation">(</span>\n    <span class="token keyword">new</span> ApiResponse<span class="token punctuation">(</span>code <span class="token operator">=</span> <span class="token number">405</span><span class="token punctuation">,</span> message <span class="token operator">=</span> <span class="token string">"Invalid Input"</span><span class="token punctuation">)</span>\n  <span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">def</span> addPet <span class="token operator">=</span>\n      post <span class="token punctuation">{</span> <span class="token comment">//stub implementation</span>\n        complete <span class="token punctuation">{</span> <span class="token string">"pet"</span> <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span></code></pre>\n      </div>\n<p>With these many annotations, you get the (almost) same specification as the sample, </p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">paths:\n  /pet:\n    post:\n      tags:\n      - &quot;pet&quot;\n      summary: &quot;Add a new pet to the store&quot;\n      description: &quot;&quot;\n      operationId: &quot;addPet&quot;\n      consumes:\n      - &quot;application/json&quot;\n      - &quot;application/xml&quot;\n      produces:\n      - &quot;application/json&quot;\n      - &quot;application/xml&quot;\n      parameters:\n      - in: &quot;body&quot;\n        name: &quot;body&quot;\n        description: &quot;Pet object that needs to be added to the store&quot;\n        required: true\n        schema:\n          $ref: &quot;#/definitions/Pet&quot;\n      responses:\n        200:\n          description: &quot;successful operation&quot;\n          schema:\n            $ref: &quot;#/definitions/Pet&quot;\n        405:\n          description: &quot;Invalid Input&quot;\n      security:\n      - petstore_auth:\n        - &quot;write:pets&quot;</code></pre>\n      </div>\n<p>but you need to repeat the same <code class="language-text">@Annotation</code> for all available HTTP methods, multiplied by the number of endpoints. In the sample applicatoin, there are endpoints, <code class="language-text">/pet</code>, <code class="language-text">/pet/{petID}</code>, <code class="language-text">/store</code>, <code class="language-text">/store/inventory</code>, …</p>\n<p>Is there a way to avoid it? Unfortunately, even for repetitive <code class="language-text">@Annotation</code>s, you cannot do like below,</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">val reuseParam1 = @ApiImplicitParam //or \nval reuseParam2 = new ApiImplicitParam\n\n@ApiImplicitParams(Array(reuseParam))\ndef ...</code></pre>\n      </div>\n<p>because you get a Scala compilation error saying:</p>\n<blockquote>\n<p>[Error] annotation argument needs to be a constant</p>\n</blockquote>\n<p>To be honest, I felt like writing up the specification directly in json or yaml would have been easier…</p>\n<p>Another thing I expected to just work fine earlier, but not avaialble at the moment is that those Swagger <code class="language-text">@Annotation</code>’s compilation errors do not detect almost any type of mismatch in the specification (<code class="language-text">@Annotation</code>) and the implementation (e.g. parameters and their types). So again, it’s all your manual effort to make sure your server implementation is compliant with the specification.</p>\n<p>Now, let’s talk about how to generate the specification file with from the server code <code class="language-text">@Annoation</code>s. You need to run the Akka HTTP web server, and access to a resource <a href="http://localhost:9999/api-docs/swagger.yaml">http://localhost:9999/api-docs/swagger.yaml</a> (or swagger.json). </p>\n<p><img src="/blog/swagger-spec-browser-b4b815a42af3dc87b08df3341fbfbfda.png" alt="swagger-spec-browser"></p>\n<p>Yes, this is another interesting point, but it seems the conventional way in the JVM world to generate the swagger spec from server code’s <code class="language-text">@Annotation</code>, even in Java frameworks like <a href="https://springfox.github.io/springfox/docs/current/#springfox-swagger-ui">Spring</a>, is to run the web server and access to the rendered page. </p>\n<p>This is NOT very Continuous-Integration friendly as your build tool won’t usually bring up the web server, so it is difficult to put the generated specification file in the build pipeline. </p>\n<p>Don’t get me wrong - I am not saying  <a href="https://github.com/swagger-akka-http/swagger-akka-http">swagger-akka-http</a> is not a satisfactory tool. It is still a nice tool when you need to integrate Swagger with Akka HTTP, and the way <code class="language-text">@Annotation</code> works is coming from Swagger <code class="language-text">@Annotation</code>, not something swagger-akka-http did in its own. </p>\n<p>And there is one nice thing about the current integration. With <code class="language-text">@ApiOperation</code>, you can specify the type of response with <code class="language-text">classOf</code> as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token annotation punctuation">@ApiOperation</span><span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">,</span> response <span class="token operator">=</span> classOf<span class="token punctuation">[</span>Pet<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p>and having the case classes defined:</p>\n<div class="gatsby-highlight">\n      <pre class="language-scala"><code class="language-scala"><span class="token keyword">case</span> <span class="token keyword">class</span> Pet<span class="token punctuation">(</span>\n    id<span class="token operator">:</span> <span class="token builtin">Long</span><span class="token punctuation">,</span>\n    category<span class="token operator">:</span> Category<span class="token punctuation">,</span>\n    name<span class="token operator">:</span> <span class="token builtin">String</span><span class="token punctuation">,</span>\n    photoUrls<span class="token operator">:</span> Array<span class="token punctuation">[</span><span class="token builtin">String</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n    tags<span class="token operator">:</span> Array<span class="token punctuation">[</span>Tag<span class="token punctuation">]</span><span class="token punctuation">,</span>\n    status<span class="token operator">:</span> <span class="token builtin">String</span>\n<span class="token punctuation">)</span>\n\n<span class="token keyword">case</span> <span class="token keyword">class</span> Category<span class="token punctuation">(</span>\n  id<span class="token operator">:</span> <span class="token builtin">Long</span><span class="token punctuation">,</span> \n  name<span class="token operator">:</span> <span class="token builtin">String</span>\n<span class="token punctuation">)</span>\n\n<span class="token keyword">case</span> <span class="token keyword">class</span> Tag<span class="token punctuation">(</span>\n  id<span class="token operator">:</span> <span class="token builtin">Long</span><span class="token punctuation">,</span>\n  name<span class="token operator">:</span> <span class="token builtin">String</span>\n<span class="token punctuation">)</span></code></pre>\n      </div>\n<p>you don’t need to add <code class="language-text">@Annotation</code> to the case classes, but Swagger UI nicely generate this much of model definition. Note that the <code class="language-text">Pet</code> case class has <code class="language-text">category: Category</code> and <code class="language-text">tags: Array[Tag]</code> parameters, but those case classes used in another case class are correctly and automatically handled by swagger spec generation.</p>\n<p><img src="/blog/swagger-model-305e2b4ba52988bfaed1b2358a59421a.png" alt="swagger-model"></p>\n<h3>Summary of the current status</h3>\n<ul>\n<li>No top-down tool available for Akka HTTP, so top-down is fully manual</li>\n<li>There is a bottom-up tool, <a href="https://github.com/swagger-akka-http/swagger-akka-http">swagger-akka-http</a> but writing <code class="language-text">@Annotation</code> is pretty much writing specification manually inside the code</li>\n<li>Compile time errors to detect specification and implementation difference are not generated by Swagger <code class="language-text">@Annotation</code>s</li>\n<li>Model definition works nicely for bottom-up</li>\n</ul>\n<p>So if you still feel it is beneficial that the endpoint specification (<code class="language-text">@Annotation</code>) being close to the Akka HTTP route implementation, rather than a separate .json/.yaml file, swagger-akka-http is the way to go. Otherwise, write and manage the specification manually.</p>\n<p><img src="/blog/annotation-next-to-code-afb115c5db16c726718d0dccaf651128.png" alt="annotation-next-to-code"></p>\n<p>With these status and limitations we have seen, do we still want to introduce Swagger to an Akka HTTP based server? Let’s take a step back and recap what benefits Swagger gives.</p>\n<h2>Recap - what Swagger is, and what Swagger’s benefits are</h2>\n<p><a href="https://swagger.io/">Swagger</a> is REST API tooling - in its core is the API specification file (.yaml or .json) and a rich set of tools to help you manage the API and develp both the server and client sides. The biggest motivation of using Swagger is well explained by the history of <a href="https://en.wikipedia.org/wiki/Swagger_(software)">Swagger at Wikipedia</a>.</p>\n<blockquote>\n<p>During the development of Wordnik’s products, the need for automation of API documentation and client SDK generation became a major source of frustration. </p>\n</blockquote>\n<p>For many development teams as of today, automation of API documentation and client SDK generation can still be the primary benefit of Swagger.</p>\n<h3>Swagger specification file (.yaml or .json)</h3>\n<p>Swagger’s specification file is standardized as in <a href="https://swagger.io/docs/specification/about/">Swagger specification</a>, and curently the specifications are called <a href="https://github.com/OAI/OpenAPI-Specification">Open API Specification 3.x</a> as it is now widely accepted and maintained as community effort. OK, the first benefit is you have a well-understood format of API documentation, which is closely related to the other benefits.</p>\n<h3>Swagger UI (Documentation generator and viewer)</h3>\n<p><img src="/blog/Swagger-UI-34b3edf56d6d39b48a7ec3ccbb9598ce.png" alt="Swagger-UI"></p>\n<p>At <a href="http://petstore.swagger.io/">http://petstore.swagger.io/</a> you can see the specification document for Swagger’s official PetStore sample, and it is generated by <a href="https://swagger.io/swagger-ui/">Swagger UI</a>. Once you have the specification file for your application, this nice-looking documentation comes for free for you too. </p>\n<p>Also when you load your spec file in <a href="https://editor.swagger.io/">Swagger Editor</a>, it spots your specification errors like below. In fully manual workflow, it will be much more difficult to spot your mistakes in specification.</p>\n<p><img src="/blog/swagger-error-98a94e736684c1c8ddc554164b48f7ea.png" alt="swagger-error"></p>\n<p>With the help of Swagger UI document generation, and clearly defined Swagger/Open API specification, the work of writing REST API specification became much more concrete (I wouldn’t say it became “easy” though), and there are clearer learning paths avaialble to improve on API management. You can find a plenty of other Swagger speficitation examples out there which you can get inspiration from, and people have published lots of materials on how to write good specification in Swagger. This made a step forward in API specification writing, so that it became a managable job for an engineer from something like black magic done by a veteran craftman with 30 years of experience. Having a concrete tool available is a huge win, where you can focus on more detailed ways to leverage tools, rather than talking about “what a good design of your REST API is” in a vague fasion. (I believe as an engineer, you have seen such phenomena in many other areas - when good tools are available, things get traction and move forward.) Of course conceptual understanding of good design is a must, but good tooling is also a must for maintaining good design in practice.</p>\n<p>Another feature I like in Swagger UI is that you can send HTTP requests by pressing buttons (as long as you write example input to the specification file). Also ig gives you curl command for the request which is great for automation of testing. Save the curl commands and invoke them by an automated tool. To use this feature, it is </p>\n<p><img src="/blog/Swagger-UI-curl-19169ae77681a3acb3d3cf4cfc9fe523.png" alt="Swagger-UI-curl"></p>\n<h3>Client code and stub server code generation</h3>\n<p>Even though no existing tool available to generate the Akka HTTP server side code, <a href="https://github.com/swagger-api/swagger-codegen">Swagger codegen</a> can still generate the client-side code for various dev environments, and server stubs.</p>\n<p>Some client-side development teams could be benefited from the code generation, as they might use the generated client code as the SDK to depend on, or might prefer the generated server stub code as for testing against the server - as long as test is concerned from the client side, they might not care whetherthe server implementation is Akka HTTP or not.</p>\n<h2>To go with or without Swagger?</h2>\n<p>So I have covered current limitations and benefits of using Swagger with Akka HTTP. Some part works nicely with the current integration, and there’s still a lot of benefits you get from the rich Swagger echosystem. It’s up to you how you evaluate the benefits against the cost you have to maintain the swagger specification. Hopefully this article gives you some hints to judge its value in your engineering team.</p>\n<h2>What’s next?</h2>\n<p>If I am going to write next article about Swagger, probably I will explore possibilities of more automation. With <a href="http://www.scala-lang.org/blog/2017/10/09/scalamacros.html">the rise of the new Scala macro</a>, probably better automation can be achieved. Let’s see what we can get there.</p>\n<h2>References</h2>\n<ul>\n<li>\n<p>Swagger home page at - <a href="https://swagger.io/">https://swagger.io/</a></p>\n<ul>\n<li>Swagger Editor - <a href="https://swagger.io/swagger-editor/">https://swagger.io/swagger-editor/</a></li>\n<li>Swagger UI - <a href="https://swagger.io/swagger-codegen/">https://swagger.io/swagger-codegen/</a></li>\n<li>Swagger Codegen - <a href="https://swagger.io/swagger-ui/">https://swagger.io/swagger-ui/</a> </li>\n<li>and Swagger Codege at GitHub - <a href="https://github.com/swagger-api/swagger-codegen">https://github.com/swagger-api/swagger-codegen</a></li>\n</ul>\n</li>\n<li>Swagger 101 tutorials at - <a href="https://app.swaggerhub.com/help/tutorials/writing-swagger-definitions">https://app.swaggerhub.com/help/tutorials/writing-swagger-definitions</a></li>\n<li>Explanation about Swagger Specification - <a href="https://swagger.io/docs/specification/about/">https://swagger.io/docs/specification/about/</a></li>\n<li>Open API specification at GitHub - <a href="https://github.com/OAI/OpenAPI-Specification">https://github.com/OAI/OpenAPI-Specification</a></li>\n<li>Springfox Java framework with Swagger at - <a href="https://springfox.github.io/springfox/docs/current/">https://springfox.github.io/springfox/docs/current/</a></li>\n</ul>',
frontmatter:{title:"Survey on Swagger with Akka HTTP",date:"March 10, 2018"}}},pathContext:{slug:"/swagger-akka-http/"}}}});
//# sourceMappingURL=path---swagger-akka-http-72da75c5bbc86a16dcd1.js.map