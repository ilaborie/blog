Ways to "try out" very easily
(e.g.) when you read someone's SQL and don't know how that works, wnat to confirm quickly
          probably in production, if there is data already in DB, you might need this for operations deeply
          buried in internal workflow chain
       when you see a code sample in blog, and want to try out quickly


Like in http://sqlfiddle.com/#!9/4fe20b/7, what if there are Akka Stream fiddle?
And what if there are generators to create input? Leveraging Scala's random data generator for tests.

create table testtable(
  id int,
  label int,
  data int,
  data2 int
);

insert into testtable (id, label, data, data2) values (1, 10, 3, 888);
insert into testtable (id, label, data, data2) values (1, 20, 32, 48);
insert into testtable (id, label, data, data2) values (1, 30, 5, 4568);
insert into testtable (id, label, data, data2) values (2, 10, 43, 844);
insert into testtable (id, label, data, data2) values (2, 10, 234, 548);
insert into testtable (id, label, data, data2) values (2, 20, 24, 688);
insert into testtable (id, label, data, data2) values (2, 20, 234, 8874);
insert into testtable (id, label, data, data2) values (2, 30, 3657, 23478);
insert into testtable (id, label, data, data2) values (3, 10, 376, 832);
insert into testtable (id, label, data, data2) values (4, 10, 3243, 468);
insert into testtable (id, label, data, data2) values (5, 10, 2343, 874);
insert into testtable (id, label, data, data2) values (6, 10, 233443, 9788);
insert into testtable (id, label, data, data2) values (6, 20, 344, 7688);
insert into testtable (id, label, data, data2) values (7, 10, 33, 2348);
