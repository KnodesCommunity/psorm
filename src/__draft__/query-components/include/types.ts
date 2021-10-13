import { NumeredRelatedMap, RelatedType, Relation } from '../../relations';
import { INumerableMultiple, INumerableSingle, Numerable, NumerableEntity } from '../numerable/types';

export interface IncludeQuery<T, TProps> {

}

export type PopulationRecord = {readonly [key: string]: true | PopulationRecord};

type IncludeEntityProps<T, TPopulation extends PopulationRecord> = Override<
	T,
	{[key in ( keyof TPopulation & keyof T )]: NumeredRelatedMap<
		T[key] extends Relation<any> ? T[key] : never,
		IncludeEntity<
			RelatedType<T[key]>,
			TPopulation[key]>>}>
type IncludeEntity<T, TPopulation extends PopulationRecord | true> =
	TPopulation extends true ? T : IncludeEntityProps<T, Exclude<TPopulation, true>>;

type Populated<TNumeration extends Numerable<any>, TPopulation extends PopulationRecord | void = void> = TPopulation extends void ?
	NumerableEntity<TNumeration> :
	IncludeEntity<NumerableEntity<TNumeration>, Exclude<TPopulation, void>>

export type PopulatedOutputType<TNumeration extends Numerable<any>, TPopulation extends PopulationRecord | void = void> =
	TNumeration extends INumerableSingle<any> ? Populated<TNumeration, TPopulation> | null :
	TNumeration extends INumerableMultiple<any> ? Array<Populated<TNumeration, TPopulation>> :
	never


export type Override<T1, T2> = Omit<T1, keyof T2> & T2
