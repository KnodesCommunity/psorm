import { Class } from 'type-fest';
import 'reflect-metadata';

export type OpaqueWrap<T, TSym extends symbol> = {[key in TSym]: T};

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type IfAny<T, Y, N> = 0 extends ( 1 & T ) ? Y : N;

export type ConstrainedPropDecorator<T> = <Prop extends string, Proto extends {[key in Prop]: T}>( proto: Proto, prop: Prop ) => void;

export const notImplemented = ( ..._args: any[] ): never => {
	throw new Error( 'Not implemented' );
};

type MetaStore<T> = ( proto: any ) => {get: () => T; set: ( v: T ) => void}
export const classMetaStoreFactory = <T>( symbol: symbol, defaultIfNotExists: () => T ): MetaStore<T> =>
	proto => {
		const set = ( val: T ) => Reflect.defineMetadata( symbol, val, proto );
		return {
			get: () => {
				const existing = Reflect.getMetadata( symbol, proto );
				if( existing ){
					return existing;
				}
				const newMeta = defaultIfNotExists();
				set( newMeta );
				return newMeta;
			},
			set,
		};
	};
export const decorateUsingMetaStore = <T>( store: MetaStore<T>, execer: ( store: T, prop: string | symbol ) => T ): PropertyDecorator =>
	( target, prop ) => {
		const { get, set } = store( target );
		set( execer( get(), prop ) );
	};

export const getProtoChain = ( cls: Class<any> ): Array<Class<any>> =>
	cls === Object || !cls?.prototype ?
		[] :
		[ cls ].concat( getProtoChain( Object.getPrototypeOf( cls ) ) );

export const sortByOther: {
	<T>( other: T[] ): ( a: T, b: T ) => number;
	<T, U = T>( other: U[], propGetter: ( v: T ) => U ): ( a: T, b: T ) => number;
	<T>( other: T[], a: T, b: T ): number;
	<T, U = T>( other: U[], a: T, b: T, propGetter: ( v: T ) => U ): number;
} = ( <T, U = T>( ...args:
| [U[]]
| [U[], ( v: T ) => U]
| [U[], T, T]
| [U[], T, T, ( v: T ) => U]
) => {
	if( args.length === 1 || args.length === 2 ) {
		return ( a: T, b: T ) => sortByOther( args[0], a, b, args[1] as any );
	} else {
		const [ other, a, b, propGetter = ( ( v: any ) => v ) as ( ( v: T ) => U ) ] = args;
		return other.indexOf( propGetter( a ) ) - other.indexOf( propGetter( b ) );
	}
} ) as any;

export const tap = <TArgs extends [void] | any[]>( fn: ( ...args: TArgs ) => void ) =>
	( ...args: TArgs ): TArgs[0] => {
		fn( ...args );
		return args[0];
	};

// eslint-disable-next-line no-underscore-dangle
export const __ = Symbol( 'PLACEHOLDER' );

export const isNil = <T>( v: T ): v is T & ( null | undefined ) => typeof v === 'undefined' || v === null;
