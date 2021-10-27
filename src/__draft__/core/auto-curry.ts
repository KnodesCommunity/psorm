export type AutoCurryMultiArgs<TArgs extends [void] | any[], TArgsBefore extends any[], TOut> =
	TArgs extends [...TArgsBefore, infer TArgSelf, ...infer TArgsAfter] ? // Check if TArgSelf is spreadable directly (so, not a rest param)
		& ( TArgsAfter extends [] ?
			// Fully curried exec
			( ( ...callArgs: [...TArgsBefore, TArgSelf] ) => TOut ) :
			// Bind call & recurse
			& ( ( ...bindArgs: [...TArgsBefore, TArgSelf] ) => AutoCurryMultiArgs<TArgsAfter, [], TOut> )
			& AutoCurryMultiArgs<TArgs, [...TArgsBefore, TArgSelf], TOut> ):
		TArgs extends [...TArgsBefore, ...infer TRest] ? // Match rest params
			[] extends TArgsBefore ? // If no params before rest
				( ( ...restArgs: TRest ) => TOut ) :
				// Concat params before rest & rest args. Must have at least one rest, otherwise returns a new function
				( ( ...callRestArgs: [...TArgsBefore, TRest[number], ...TRest] ) => TOut ) :
			any
export type AutoCurry<TArgs extends [void] | any[], TOut> = AutoCurryMultiArgs<TArgs, [], TOut>
export type AutoCurriedFn<TFn extends ( ...args: any[] ) => any> = AutoCurry<Parameters<TFn>, ReturnType<TFn>>
/**
 * Prepare a curry function: the returned function is a high order function you can deeply call multiple times to pass arguments in multiple calls.
 *
 * @example ```ts
 * const curried = autoCurry((a: string, b: number, c: boolean) => new Foo());
 * assert(curried('foo', 2, false) instanceof Foo);
 * assert(curried('foo', 2)(false) instanceof Foo);
 * assert(curried('foo')(2, false) instanceof Foo);
 * assert(curried('foo')(2)(false) instanceof Foo);
 * ```
 *
 * When using rest parameters, pass `true` to {@link hasRest}. Rest arguments are required to run the function; if none are given, a new lambda is returned.
 * You can call this last lambda without args to execute {@link fn} with an empty rest args list.
 * @example ```ts
 * const curried = autoCurry(
 *     (a: string, ...rest: number[]) => new Foo(),
 *     undefined, // curriedArgs, auto determined
 *     true // hasRest
 * );
 * assert(curried('foo') instanceof Foo); // throws
 * assert(curried('foo', 2) instanceof Foo);
 * assert(curried('foo', 2, 3, 4, 5) instanceof Foo);
 * assert(curried('foo')() instanceof Foo);
 * assert(curried('foo')(2) instanceof Foo);
 * assert(curried('foo')(2, 3, 4, 5) instanceof Foo);
 * ```
 * @param fn - The function to curry
 * @param hasRest - Boolean indicating if it expects a rest parameter.
 * @param curriedArgs - The number of arguments to curry
 * @returns a curried version of {@link fn}.
 */
export const autoCurry = <TArgV extends [void] | any[], TOut>(
	fn: ( ...args: TArgV ) => TOut,
	hasRest = false,
	curriedArgs = fn.length,
): AutoCurry<TArgV, TOut> =>
	( ...args: any ) => {
		// If we are not currying a variadic function, exec if we have exactly the desired number of arguments
		// Anyway, exec if we have more args than required.
		if( ( !hasRest && args.length === curriedArgs ) || args.length > curriedArgs ){
			return fn( ...args ) as any;
		} else {
			const newFn = ( ...args2: any ) => fn( ...[ ...args, ...args2 ] as any );
			const argsLeftToPass = curriedArgs - args.length;
			Object.defineProperty( newFn, 'length', { value: argsLeftToPass } );
			// If this call has rest parameter, next call will execute the underlying function even if no params.
			const nextCurryHasRest = hasRest ?
				argsLeftToPass === 0 ? false : true :
				false;
			return autoCurry<any[], TOut>( newFn, nextCurryHasRest ) as AutoCurryMultiArgs<TArgV, [], TOut>;
		}
	};
