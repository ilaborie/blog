dispatcher type:
 "Dispatcher" 
 //this is a string value allowed (i.e. not a config path pointing somewhere else), due to the following def configuratorFrom(), 
 "PinnedDispatcher"
 "BalancingDispatcher"
 or fqn, with prerequisits (DispatcherConfigurator?)

executor type
 - "fork-join-executor", "", null
 - "thread-pool-executor"
 - "affinity-pool-executor"
 //similar to dispatcher names, they are just string values not config paths



//class Dispatchers
  private def configuratorFrom(cfg: Config): MessageDispatcherConfigurator = {
    if (!cfg.hasPath("id")) throw new ConfigurationException("Missing dispatcher 'id' property in config: " + cfg.root.render)

    cfg.getString("type") match {
      case "Dispatcher" ⇒ new DispatcherConfigurator(cfg, prerequisites)
      case "BalancingDispatcher" ⇒
        // FIXME remove this case in 2.4
        throw new IllegalArgumentException("BalancingDispatcher is deprecated, use a BalancingPool instead. " +
          "During a migration period you can still use BalancingDispatcher by specifying the full class name: " +
          classOf[BalancingDispatcherConfigurator].getName)
      case "PinnedDispatcher" ⇒ new PinnedDispatcherConfigurator(cfg, prerequisites)
      case fqn ⇒
        val args = List(classOf[Config] → cfg, classOf[DispatcherPrerequisites] → prerequisites)
        prerequisites.dynamicAccess.createInstanceFor[MessageDispatcherConfigurator](fqn, args).recover({
          case exception ⇒
            throw new ConfigurationException(
              ("Cannot instantiate MessageDispatcherConfigurator type [%s], defined in [%s], " +
                "make sure it has constructor with [com.typesafe.config.Config] and " +
                "[akka.dispatch.DispatcherPrerequisites] parameters")
                .format(fqn, cfg.getString("id")), exception)
        }).get
    }
  }

 abstract class MessageDispatcherConfigurator(_config: Config, val prerequisites: DispatcherPrerequisites) {

  def configureExecutor(): ExecutorServiceConfigurator = {
    def configurator(executor: String): ExecutorServiceConfigurator = executor match {
      case null | "" | "fork-join-executor" ⇒ new ForkJoinExecutorConfigurator(config.getConfig("fork-join-executor"), prerequisites)
      case "thread-pool-executor"           ⇒ new ThreadPoolExecutorConfigurator(config.getConfig("thread-pool-executor"), prerequisites)
      case "affinity-pool-executor"         ⇒ new AffinityPoolConfigurator(config.getConfig("affinity-pool-executor"), prerequisites)



Things to blog about
Dispatcher Configurator
Executor Configurator
Config backing mechanism 
//e.g. below fork-join-executorXX will be ignored as the (dispatcher?) configurator specifically needs fork-join-executor path inside the dispatcher section, so it's backed by the default in akka-actor (with CacheConfig class?)
    my-dispatcher4 {
    type = Dispatcher
    executor = "fork-join-executor"
    fork-join-executorXX {
        # Min number of threads to cap factor-based parallelism number to
        parallelism-min = 2
        # Parallelism (threads) ... ceil(available processors * factor)
        parallelism-factor = 2.0
        # Max number of threads to cap factor-based parallelism number to
        parallelism-max = 10
    }
    throughput = 100
    }

Define your own executor 
Define your own dispatcher (another post?) 