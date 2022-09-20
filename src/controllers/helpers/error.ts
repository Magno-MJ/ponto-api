export function error(err: any) {
	return {
		statusCode: err.statusCode,
		body: err.message
	};
}