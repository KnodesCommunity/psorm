export type OpaqueWrap<T, TSym extends symbol> = {[key in TSym]: T};

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type IfAny<T, Y, N> = 0 extends ( 1 & T ) ? Y : N;

export const notImplemented = ( ..._args: any[] ): never => {
	throw new Error( 'Not implemented' );
};
