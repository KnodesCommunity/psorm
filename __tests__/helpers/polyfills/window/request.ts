class _Request implements Request {
	public readonly cache!: RequestCache;
	public readonly credentials!: RequestCredentials;
	public readonly destination!: RequestDestination;
	public readonly headers!: Headers;
	public readonly integrity!: string;
	public readonly keepalive!: boolean;
	public readonly method!: string;
	public readonly mode!: RequestMode;
	public readonly redirect!: RequestRedirect;
	public readonly referrer!: string;
	public readonly referrerPolicy!: ReferrerPolicy;
	public readonly signal!: AbortSignal;
	public readonly body!: ReadableStream<Uint8Array> | null;
	public readonly bodyUsed!: boolean;
	public constructor( public readonly url: string, init: RequestInit ){
		Object.assign( this, init );
	}
	public clone(): Request {
		throw new Error( 'Method not implemented.' );
	}
	public arrayBuffer(): Promise<ArrayBuffer> {
		throw new Error( 'Method not implemented.' );
	}
	public blob(): Promise<Blob> {
		throw new Error( 'Method not implemented.' );
	}
	public formData(): Promise<FormData> {
		throw new Error( 'Method not implemented.' );
	}
	public json(): Promise<any> {
		throw new Error( 'Method not implemented.' );
	}
	public text(): Promise<string> {
		throw new Error( 'Method not implemented.' );
	}
}
export { _Request as Request };
