export const shortBaseUrl: string = "http://short.est";
export const successResponseMessage: string = "successful";
export const errorResponseMessage: string = "failure";

export const validLongUrl = "https://www.indicina.com";
export const validHttpUrl = "http://www.indicina.co";
export const validUrlWithQuery = "https://www.indicina.co/search?q=dev";
export const longUrlForEdgeCase = "https://www.indicina.co/about";
export const shortUrlRegex = new RegExp(`^${shortBaseUrl.replace('.', '\\.')}/[A-Za-z0-9]+$`);

export const longUrlRequiredErrorMessage = "Long URL is required";
export const longUrlInvalidErrorMessage = "Invalid URL. must be a valid HTTP/HTTPS URL.";
export const longUrlDuplicateErrorMessage = "The URL has already been encoded.";

export const shortUrlRequiredErrorMessage = "Short URL is required";
export const shortUrlNotFoundErrorMessage = "Short URL not found";

export const apiBaseUrl = "/api/v1";

export const encodeBaseUrl = `${apiBaseUrl}/encode`;
export const decodeBaseUrl = `${apiBaseUrl}/decode`;

export const NOT_FOUND_HTTP_STATUS_CODE = 404;
export const BAD_REQUEST_HTTP_STATUS_CODE = 400;
export const OK_HTTP_STATUS_CODE = 200;
export const INTERNAL_SERVER_ERROR_HTTP_STATUS_CODE = 500;
export const CONFLICT_HTTP_STATUS_CODE = 409;