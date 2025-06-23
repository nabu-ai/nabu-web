const NABU_PUBLIC_BASE_PATH = process.env.NABU_PUBLIC_BASE_PATH ?? "/api/";
const NABU_USER_API_ENDPOINT = process.env.NABU_USER_API_ENDPOINT ?? "http://localhost:8081/api/";
const NABU_MEETING_API_ENDPOINT = process.env.NABU_MEETING_API_ENDPOINT ?? "http://localhost:8083/api/";
const NABU_TENANT_API_ENDPOINT = process.env.NABU_TENANT_API_ENDPOINT ?? "http://localhost:8082/api/";
const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

export { NABU_PUBLIC_BASE_PATH, NABU_USER_API_ENDPOINT, IS_DEVELOPMENT_ENV, NABU_MEETING_API_ENDPOINT };
