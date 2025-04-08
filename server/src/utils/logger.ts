import winston from "winston";
import { NODE_ENV } from "./env";

const { combine, timestamp, json, label, printf, colorize } = winston.format;

const productionFormat = combine(
  label({ label: "API-Production" }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  json()
);

const developmentFormat = combine(
  label({ label: "API-Development" }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  json(),
  colorize({
    all: true,
    colors: {
      error: "red",
      warn: "yellow",
      info: "green",
      http: "magenta",
      verbose: "cyan",
      debug: "blue",
      silly: "gray",
    },
  }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaData = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} ${level} ${message} ${metaData} ${stack ?? ""}`;
  })
);

let transports = [];

if (NODE_ENV !== "production") {
  transports.push(new winston.transports.Console());
} else {
  transports.push(new winston.transports.File({ filename: "error.log", level: "error" }));
  transports.push(new winston.transports.File({ filename: "combined.log" }));
}

const logger = winston.createLogger({
  level: "debug",
  format: NODE_ENV === "production" ? productionFormat : developmentFormat,
  transports,
});

export default logger;
