#!/usr/bin/env node

import process from "node:process";

import { execute } from "../lib/bootstrap.mjs";

try {
  const result = execute(process.argv.slice(2));
  console.log(JSON.stringify(result, null, 2));
  if (result.command === "doctor" && !result.healthy) process.exitCode = 2;
} catch (error) {
  console.error(`men-of-letters: ${error.message}`);
  process.exitCode = 1;
}
