export type OpaqueWrap<T, TSym extends symbol> = {[key in TSym]: T};

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export const notImplemented = ( ...args: any[] ): never => {
	throw new Error( 'Not implemented' );
};
