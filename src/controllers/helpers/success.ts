export function success(data: any, statusCode: number) {
	return ({
		statusCode,
		body: data
	});
}