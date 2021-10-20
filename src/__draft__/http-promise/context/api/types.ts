import { IQueryContext } from '../../plugins/types';

export type Descriptor = {
	context: Readonly<IQueryContext>;
	request?: Partial<RequestInit>;
	url?: Descriptor.Url;
	params?: ConstructorParameters<typeof URLSearchParams>[0];
}
export namespace Descriptor {
	export type Url = Partial<Pick<
		URL,
		Exclude<
			keyof URL,
			| 'toString'
			| 'origin'
			| 'searchParams'
			| 'toJSON'>>>;
}
export type RequestGeneratorRet = {request: Request; postHooks: unknown[]} | null;
export type RequestGenerator = ( parentDescriptor: Descriptor, next: RequestGeneratorNextFn ) => RequestGeneratorRet | null;
export type RequestGeneratorNextFn = ( desc: Descriptor ) => RequestGeneratorRet;
export interface IRequestGenerator {
	readonly generate: RequestGenerator;
}
