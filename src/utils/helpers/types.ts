export type ExtractSingle<U> = U extends (infer T)[] ? T : U;
