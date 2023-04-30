import { Environment } from "../types";

export const env = (): Environment => {
    return process.env.ENV as Environment || 'dev';
};
