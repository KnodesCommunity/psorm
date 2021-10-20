declare namespace jest {
	interface Matchers<R, T> {
		toThrowNonStandardMessage(): R;
	}
}
