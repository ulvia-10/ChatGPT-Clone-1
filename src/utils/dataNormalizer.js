import { Deserializer } from "ts-jsonapi";

const format = new Deserializer({ keyForAttribute: "camelCase" });

export function dataNormalizer(rawData) {
  return {
    data: format.deserialize(rawData),
    meta: rawData.meta,
  };
}
