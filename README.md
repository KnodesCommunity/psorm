# PSORM

Experimental FP & Composition-oriented ORM

## Glossary

> **Note**: This section is put at the beginning because some names are not definitive.
> 
> **Please feedback**

<dl>
<dt>Intent</dt>
<dd>:question: Might be called <em>Operation</em></dd>

<dt>Data source</dt>
<dd>:question: Might be called <em>data context</em></dd>

<dt>Operator</dt>
<dd></dd>
</dl>

## Philosophy

### :cherries: **Built for tree-shakeability and cherry-picking**

Don't need relations ? Well, don't ship the code for it. Use only `read` operation ? Then why bothering bundling `update`, `delete` & `create` if you don't use them ?

The whole structure of the project if thought so that you keep your bundles as small as possible, for a real highly extensible ORM for both back-end & front-end.

### :fork_and_knife: **Highly customizable**

Most behaviors are split in super-small-sized pieces that you can compose together. Let's play with `takeMeal(using(fingers()))` & `takeMeal(using(fork(), knife(), plate()))`.

### :lock: **Side-effect free**

By eliminating states & classes, you reduce the chances of random bugs due to states of the ORM. If you have an unexpected result, then your source has unexpected data. Period.

### :bulb: **Inspired by Functional Programming, RxJS <img src="https://rxjs.dev/assets/images/favicons/favicon.ico" alt="RxJS logo" style="height: 1em;"/> operators & Express <img src="https://expressjs.com/images/favicon.png" alt="Express logo" style="height: 1em;"/> middlewares**

This way, you can easily find your marks. And if you're not familiar with those, PSORM will give you a hand.

## Concepts

<details open>
<summary>
:grey_question: Legend used accros this document :
</summary>

* Operation intent: **C** ⇒ Create | **R** ⇒ Read | **U** ⇒ Update | **D** ⇒ Delete
* Numeration: **1**: Single | **X**: Multiple
* State:
  * **:question: Maybe not pertinent**: This operation might have no meaning for the given data source.
  * **:dart: Targetted feature**: It should be doable to validate the POC for a real 0.0.x release.
  * **:construction: Experimental**: This may need further testing, but basic implementation & tests cases are OK.
  * **:white_check_mark: Valid**: The feature has been extensively tested, and might be ready for real-life usages.
  * **:tada: Working**: The feature has been heavily tested and used in real-life scenarios.
  * **:feet: Needs extra configuration**: This operator not only modify the query itself, but also its executor middleware, like editing the output.
    
    In that case, to avoid hard dependencies, the operator extension should be configured in the executor before usage.

</details>

### Data sources

Data source instances classes/objects are monolithic blocks that allows to setup shared configuration between intents.

> **Example**
> For HTTP REST, the data source might specify the base URL, the entity-to-path mapping, how filters & options are passed to the server via the request, etc etc.
> 
> For MySQL or MongoDB, this might be directly the raw driver instance, or a wrapper to handle middlewares.

> Since this class is monolithic, and used by every intent of the same data-source package, it should be as light as possible, externalizing almost everything in *intent*s, *operators* or *data-source middleware*. 

### Intents

Intents represent the kind of operation to do. Standard ones (that might be probably implemented by every data-source) are
* **C**reate
* **R**ead
* **U**pdate
* **D**elete

> :question: some data-sources may have more. For instance, `pubsub` of *MongoDB* might be either an *intent* on its own, or an *operator extension*. Yet, an *intent* seems more appropriate since it would drastically change the return type of a normal `read`, and would return an *Observable* instead of a *Promise*.

### Operators

Operators are function (typically pure) that affects the *intent*. It may change:
* the input (*intent* command), like by adding a filter, an option, switching between entities, etc
* or the output (*intent* return), like by executing another intent before returning, or replace the output.

#### Special operators

##### `single` & `multiple` (required, :moyai:)

##### `from` (required, :moyai:)

##### `filter` (:dart::moyai:)

##### `options` (:dart::moyai:)

#### Operators extensions

In addition to standard monolithic (:moyai:) or source-agnostic operators, PSORM exposes an operator factory API inspired by RxJS & express middlewares to implement custom source-specific behaviors.

> **Example**, `include` on a simple *HTTP REST API* would do multiple requests (first for the base entity, then one other querying for IDs of the relation, and so on), while switching to an aggregation with `$lookup` on *MongoDB*, or doing a join on *MySQL*.

Custom or extension operators might probably require [data-source middlewares](#data-source-middlewares) declared at the data-source level.

|               | Intent | Numeration | http-rest-promise :construction:                             | http-rest-observable :dart:                   | mongodb :dart: | mysql :dart:  |
|:-------------:|:------:|:----------:|:------------------------------------------------------------:|:---------------------------------------------:|:--------------:|:-------------:|
|    include    | CRUD   | 1X         | :dart:                                                       | :dart:                                        | :dart:         | :dart:        |
|  withPrevNext | R      | 1          | :construction: :feet:                                        | :dart:                                        | :dart:         | :dart:        |
|     orFail    | R      | 1          | :dart:                                                       | :dart:                                        | :dart:         | :dart:        |
| inTransaction | CUD    | 1X         | :question: <a href="#opext1" id="opext1ref"><sup>1</sup></a> | :question: <a href="#opext1"><sup>1</sup></a> | :dart:         | :dart:        |

##### Notes

###### <a id="opext1" href="#opext1ref"><sup>1</sup> HTTP REST transactions</a>

HTTP REST transactions kind of defeat one of the core principle of REST: being stateless. If a single atomic request is expected to do multiple operations, then you might probably use a non-REST endpoint for that operation.

If implemented nonetheless on basic HTTP REST API, *UD* operations should be preceded by a *R* to get a snapshot of the state of the resource before modification. Rollback is applied by the reverse operation (eg: *U*⇒*U*, *C*⇒*D*, *D*⇒*C*).

If PSORM is exposed as a server-side middleware (like an express or NestJS middleware), transaction code might be sent to server for execution in a very restricted sandbox. This has huge security concerns with discussable benefits, but might allow usage of the native DB transaction system (MongoDB, MySQL, etc)

### Data source middlewares

Those functions are typically in charge of handling *how* an operator is executed against the data source.

> **Example**: `withPrevNext` is an operator for HTTP REST API that fetches the entity immediately *before* and *after* the desired entity. A data-source middleware might be used to configure how it is actually executed.

> :question: For the example above, it might also be set by composition. Pseudo code would be like
> ```ts
> const withPrevNext = autoCurry((executor: SomethingToDetermine, ...innerOperators: QueryOperatorFn<...>[]) => {
>     // ...
> });
> 
> const myWithPrevNext = withPrevNext(myExecutor);
> 
> read(
>     single(Foo),
>     from(context)
>     myWithPrevNext({prevNext: include(f => f.bar())}))
> ```
> This approach would have the advantage of still decreasing the coupling between data-source shared configuration, and allow a per-query behavior. yet, this can also be problematic.

## Additional informations

### Documentation

#### General

Documentation for data-source packages should group symbols by tags, pretty much like the [RxJS API](https://rxjs.dev/api) do.

Main tags would be

* **Data-source** (see [Concepts ⇒ Data sources](#data-sources)): Each source package might most probably have one and only one data source class.
* **Intent** (see [Concepts ⇒ Intents](#intents)): the kind of operation to do. Standard ones (that might be probably implemented by every data-source) are
  * **C**reate
  * **R**ead
  * **U**pdate
  * **D**elete
  
  Intents might have their own required *operators* that should be specified in documentation
* **Operator** (see [Concepts ⇒ Operators](#operators))
  > Custom or extension operators might probably require *data-source middlewares* declared at the data-source level.
* **Data-source middleware** (see [Concepts ⇒ Data-source middlewares](#data-source-middlewares)).
