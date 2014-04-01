module Bacon {
  declare var require: (path: string) => any;

  var bacon = require("baconjs");

  export interface Event<T> {
    value(): T;
    hasValue(): boolean;
    isNext(): boolean;
    isInitial(): boolean;
    isError(): boolean;
    isEnd(): boolean;
  }

  export interface Error<T> extends Event<T> {}
  export interface End<T> extends Event<T> {}
  export interface Initial<T> extends Event<T> {}
  export interface Next<T> extends Event<T> {}

  export var Error: {
    new <T>(error): Error<T>;
  } = bacon.Error;
  export var End: {
    new <T>(): End<T>;
  } = bacon.End;
  export var Next: {
    new <T>(value: T): Next<T>;
    new <T>(generatorFunc: () => T): Next<T>;
  } = bacon.Next;

  export interface Observable<T> {
    onValue(fn: (value: T) => void): void;
    onError(fn: (error) => void): void;
    onEnd(fn: () => void): Function;

    map<U>(fn: (value: T) => U): EventStream<U>;
    mapError(fn: (error) => any): EventStream<T>;
    errors(): EventStream<any>;
    skipErrors(): EventStream<T>;
    mapEnd(f: () => T): EventStream<T>;
    mapEnd(value: T): EventStream<T>;
    filter(f: (value: T) => boolean): EventStream<T>;
    filter(boolean): EventStream<T>;
    filter(propertyExtractor: string): EventStream<T>;
    filter(property: Property<boolean>): EventStream<T>;
    takeWhile(f: (value: T) => boolean): EventStream<T>;
    takeWhile(property: Property<boolean>): EventStream<T>;
    take(n: number): EventStream<T>;
    takeUntil(stream: EventStream<any>): EventStream<T>;
    skip(n: number): EventStream<T>;
    delay(delay: number): EventStream<T>;
    throttle(delay: number): EventStream<T>;
    debounce(delay: number): EventStream<T>;
    debounceImmediate(delay: number): EventStream<T>;
    doAction(f: (value: T) => void): EventStream<T>;
    doAction(propertyExtractor: string): EventStream<T>;
    not(): EventStream<boolean>;
    flatMap<U>(f: (value: T) => Observable<U>): EventStream<U>;
    flatMapLatest<U>(f: (value: T) => Observable<U>): EventStream<U>;
    flatMapFirst<U>(f: (value: T) => Observable<U>): EventStream<U>;
    scan<U>(seed: U, f: (acc: U, next: T) => U): EventStream<U>;
    fold<U>(seed: U, f: (acc: U, next: T) => U): Property<U>;
    reduce<U>(seed: U, f: (acc: U, next: T) => U): Property<U>;
    diff<U>(start: T, f: (a: T, b: T) => U): Property<U>;
    zip<U, V>(other: EventStream<U>, f: (a: T, b: U) => V): EventStream<V>;
    slidingWindow(max: number, min?: number): Property<T[]>;
    log(): Observable<T>;
    combine<U, V>(other: Observable<U>, f: (a: T, b: U) => V): Property<V>;
    withStateMachine<U, V>(initState: U, f: (state: U, event: Event<T>) => StateValue<U, V>): EventStream<V>;
    decode(mapping: Object): Property<any>;
    awaiting<U>(other: Observable<U>): Property<boolean>;
    endOnError(f?: (value: T) => boolean): Observable<T>;
    withHandler(f: (event: Event<T>) => any): Observable<T>;
    name(name: string): Observable<T>;
    withDescription(...args: any[]): Observable<T>;
  }

  export interface StateValue<State, Type> {
    0: State;
    1: Event<Type>[];
  }

  export interface Property<T> extends Observable<T> {
    toEventStream(): EventStream<T>;
    subscribe(f: (event: Event<T>) => any): () => void;
    onValue(f: (value: T) => any): () => void;
    onValues(f: (...args: any[]) => any): () => void;
    assign(obj: Object, method: string, ...params: any[]): void;
    sample(interval: number): EventStream<T>;
    sampledBy(stream: EventStream<any>): EventStream<T>;
    sampledBy(property: Property<any>): Property<T>;
    sampledBy<U, V>(obs: Observable<U>, f: (value: T, samplerValue: U) => V): EventStream<V>;
    skipDuplicates(isEqual?: (a: T, b: T) => boolean): Property<T>;
    changes(): EventStream<T>;
    and(other: Property<T>): Property<T>;
    or(other: Property<T>): Property<T>;
    startWith(value: T): Property<T>;
  }

  export interface EventStream<T> extends Observable<T> {
    map<U>(fn: (value: T) => U): EventStream<U>;
    map<U>(property: Property<U>): EventStream<U>;

    subscribe(f: (event: Event<T>) => any): () => void;
    onValue(f: (value: T) => any): () => void;
    onValues(f: (...args: any[]) => any): () => void;
    skipDuplicates(isEqual?: (a: T, b: T) => boolean): EventStream<T>;
    concat(other: EventStream<T>): EventStream<T>;
    merge(other: EventStream<T>): EventStream<T>;
    startWith(value: T): EventStream<T>;
    skipWhile(f: (value: T) => boolean): EventStream<T>;
    skipWhile(property: Property<boolean>): EventStream<T>;
    skipUntil(stream: EventStream<any>): EventStream<T>;
    bufferWithTime(delay: number): EventStream<T[]>;
    bufferWithTime(f: (f: Function) => void): EventStream<T[]>;
    bufferWithCount(count: number): EventStream<T[]>;
    bufferWithTimeOrCount(delay: number, count: number): EventStream<T[]>;
    toProperty(initialValue?: T): Property<T>;
  }

  export interface Bus<T> extends EventStream<T> {
    push(value: T): void;
    end(): void;
    error(e: Error<T>): void;
    plug(stream: EventStream<T>): void;
  }

  export var fromPromise: <T>(promise, abort?: boolean) => EventStream<T> = bacon.fromPromise;
  export var fromEventTarget: <T>(target: EventTarget, eventName: string, eventTransformer?: <U>(from: U) => T) => EventStream<T> = bacon.fromEventTarget;
  export var fromCallback: <T>(f: (...args: any[]) => void, ...args: any[]) => EventStream<T> = bacon.fromCallback;
  export var fromNodeCallback: <T>(f: (...args: any[]) => void, ...args: any[]) => EventStream<T> = bacon.fromNodeCallback;
  export var fromPoll: <T>(interval: number, f: () => Event<T>) => EventStream<T> = bacon.fromPoll;
  export var once: <T>(value: T) => EventStream<T> = bacon.once;
  export var errorOnce: <T>(value: Error<T>) => EventStream<T> = bacon.once;
  export var fromArray: <T>(values: T[]) => EventStream<T> = bacon.fromArray;
  export var interval: <T>(interval: number, value: T) => EventStream<T> = bacon.interval;
  export var sequentially: <T>(interval: number, values: T[]) => EventStream<T> = bacon.sequentially;
  export var repeatedly: <T>(interval: number, values: T[]) => EventStream<T> = bacon.repeatedly;
  export var never: () => EventStream<any> = bacon.never;
  export var later: <T>(delay: number, value: T) => EventStream<T> = bacon.later;

  export var constant: <T>(value: T) => Property<T> = bacon.constant;

  export var combineAsArray: <T>(streams: Observable<T>[]) => Property<T[]> = bacon.combineAsArray;
  export var combineWith: <T, U>(f: (...args: T[]) => U, streams: Observable<T>[]) => Property<U> = bacon.combineWith;
  export var combineTemplate: <T>(template: Object) => Property<T> = bacon.combineTemplate;
  export var mergeAll: <T>(streams: EventStream<T>[]) => EventStream<T> = bacon.mergeAll;
  export var zipAsArray: <T>(streams: EventStream<T>[]) => EventStream<T[]> = bacon.zipAsArray;
  export var zipWith: <T, U>(streams: EventStream<T>[], f: (...args: T[]) => U) => EventStream<U> = bacon.zipWith;
  export var onValues: (...args: any[]) => void;

  export var fromBinder: <T>(subscribe: (sink: Sink<T>) => () => void) => EventStream<T> = bacon.fromBinder;

  export interface Sink<T> {
    (value: T): any;
    (event: Event<T>): any;
    (events: Event<T>[]): any;
  }

  export var when: <T>(...args: any[]) => Observable<T> = bacon.when;
  export var update: <T>(initial: T, ...args: any[]) => Property<T> = bacon.when;

  export var more = bacon.more;
  export var noMore = bacon.noMore;

  export var EventStream: {
    new <T>(subscribe: (event: Event<T>) => void): EventStream<T>;
  } = bacon.EventStream;

  export var Property: {
    new <T>(subscribe: (event: Event<T>) => void): Property<T>;
  } = bacon.Property;

  export var Bus: {
    new <T>(): Bus<T>;
  } = bacon.Bus;

  export var ticks: () => EventStream<number> = () => {
    // Get the right animation frame method
    var requestAnimFrame, cancelAnimFrame;
    if ((<any>window).requestAnimationFrame) {
      requestAnimFrame = (<any>window).requestAnimationFrame;
      cancelAnimFrame = (<any>window).cancelAnimationFrame;
    } else if ((<any>window).mozRequestAnimationFrame) {
      requestAnimFrame = (<any>window).mozRequestAnimationFrame;
      cancelAnimFrame = (<any>window).mozCancelAnimationFrame;
    } else if ((<any>window).webkitRequestAnimationFrame) {
      requestAnimFrame = (<any>window).webkitRequestAnimationFrame;
      cancelAnimFrame = (<any>window).webkitCancelAnimationFrame;
    } else if ((<any>window).msRequestAnimationFrame) {
      requestAnimFrame = (<any>window).msRequestAnimationFrame;
      cancelAnimFrame = (<any>window).msCancelAnimationFrame;
    } else if ((<any>window).oRequestAnimationFrame) {
      requestAnimFrame = (<any>window).oRequestAnimationFrame;
      cancelAnimFrame = (<any>window).oCancelAnimationFrame;
    } else {
      requestAnimFrame = function(cb) { (<any>window).setTimeout(cb, 1000 / 60); };
      cancelAnimFrame = (<any>window).clearTimeout;
    }

    return fromBinder<number>((sink) => {
      var id;
      function tick(t) {
        if (sink(new Next(t)) !== noMore) {
          id = requestAnimFrame(tick);
        }
      }
      id = requestAnimFrame(tick);
      return function() {
        cancelAnimFrame(id);
      };
    });
  };
}

export = Bacon;
