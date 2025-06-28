const NABU_PUBLIC_BASE_PATH = process.env.NABU_PUBLIC_BASE_PATH ?? "/api/";

// const NABU_USER_API_ENDPOINT = process.env.NABU_USER_API_ENDPOINT ?? "http://localhost:8081/api/users";
// const NABU_AUTH_API_ENDPOINT = process.env.NABU_AUTH_API_ENDPOINT ?? "http://localhost:8081/api/auth";
// const NABU_GUEST_API_ENDPOINT = process.env.NABU_GUEST_API_ENDPOINT ?? "http://localhost:8081/api/guest";
// const NABU_MEETING_API_ENDPOINT = process.env.NABU_MEETING_API_ENDPOINT ?? "http://localhost:8083/api/meetings";
// const NABU_GUEST_MEETING_API_ENDPOINT = process.env.NABU_GUEST_MEETING_API_ENDPOINT ?? "http://localhost:8083/api/guest/meetings";
// const NABU_TENANT_API_ENDPOINT = process.env.NABU_TENANT_API_ENDPOINT ?? "http://localhost:8082/api/";

// const NABU_SERVER_HOST = "https://api.nabu-io.com";//https://nabu-0390bfe7dc2f.herokuapp.com"
// const NABU_PUBLIC_API_ENDPOINT = "http://localhost:8081"

// const NABU_MEETING_HOST = `${NABU_SERVER_HOST}/api/meeting`
// const NABU_TENANT_HOST = `${NABU_SERVER_HOST}/api/tenant`
// const NABU_USER_HOST = `${NABU_SERVER_HOST}/api/user`

const NABU_SERVER_HOST = "https://api.marisolsoftware.com";//https://nabu-0390bfe7dc2f.herokuapp.com"
const NABU_PUBLIC_API_ENDPOINT = "http://localhost:8081"

// const NABU_MEETING_HOST = `${NABU_SERVER_HOST}:8083`
// const NABU_TENANT_HOST = `${NABU_SERVER_HOST}:8082`
// const NABU_USER_HOST = `${NABU_SERVER_HOST}:8081`

const NABU_MEETING_HOST = `${NABU_SERVER_HOST}/api/meeting`
const NABU_TENANT_HOST = `${NABU_SERVER_HOST}/api/tenant`
const NABU_USER_HOST = `${NABU_SERVER_HOST}/api/user`

const NABU_USER_API_ENDPOINT = process.env.NABU_USER_API_ENDPOINT ?? `${NABU_USER_HOST}/api/users`;
const NABU_AUTH_API_ENDPOINT = process.env.NABU_AUTH_API_ENDPOINT ?? `${NABU_USER_HOST}/api/auth`;
const NABU_GUEST_API_ENDPOINT = process.env.NABU_GUEST_API_ENDPOINT ?? `${NABU_USER_HOST}/api/guest`;
const NABU_MEETING_API_ENDPOINT = process.env.NABU_MEETING_API_ENDPOINT ?? `${NABU_MEETING_HOST}/api/meetings`;
const NABU_GUEST_MEETING_API_ENDPOINT = process.env.NABU_GUEST_MEETING_API_ENDPOINT ?? `${NABU_MEETING_HOST}/api/guest/meetings`;
const NABU_TENANT_API_ENDPOINT = process.env.NABU_TENANT_API_ENDPOINT ?? `${NABU_TENANT_HOST}/api/`;

const NABU_DOMAIN = process.env.NABU_DOMAIN ?? "https://nabu-io.com";


const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

export { NABU_PUBLIC_BASE_PATH, NABU_USER_API_ENDPOINT, IS_DEVELOPMENT_ENV, NABU_MEETING_API_ENDPOINT, 
    NABU_AUTH_API_ENDPOINT, NABU_GUEST_MEETING_API_ENDPOINT, NABU_GUEST_API_ENDPOINT, NABU_TENANT_API_ENDPOINT,
    NABU_DOMAIN, NABU_MEETING_HOST, NABU_USER_HOST, NABU_TENANT_HOST };


