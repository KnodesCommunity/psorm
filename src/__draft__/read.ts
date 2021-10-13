// type TemplateStrignsArrayOf<T extends ReadonlyArray<string>> = TemplateStringsArray & T & {raw: T};
// export const read = <T>(
//     strings: TemplateStrignsArrayOf<readonly ['single ', ' from ', ' where ']>,
//     entity: Type<T>,
//     context: unknown,
//     query: any
// ): Promise<T | null> => Promise.resolve(null);

import { IncludeQuery, PopulatedOutputType, PopulationRecord } from './query-components/include/types';
import { INumerableBase, Numerable, NumerableEntity, NumerableOutputType } from './query-components/numerable/types';
import { TargetContext } from './query-components/source/types';

export const read: {
	<TNumeration extends Numerable<any>>(
		output: TNumeration,
		targetContext: TargetContext<any>,
	): Promise<NumerableOutputType<TNumeration>>;
	<TNumeration extends Numerable<any>, TPopulation extends PopulationRecord | void = void>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		include: IncludeQuery<NumerableEntity<TNumeration>, TPopulation>,
	): Promise<PopulatedOutputType<TNumeration, TPopulation>>;
} = ( ...args: any[] ) => Promise.resolve( null as any );
