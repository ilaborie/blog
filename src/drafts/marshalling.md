doing JSON <-> case class, field-by-field conversion is not enough,
as Akka HTTP has all well typed HTTP models. So it doesn't return JSON type to the client, but it needs to be HttpResponse, holding ResponseEntity inside. How does this happen? Akka HTTP and Spray JSON takes care of it.
