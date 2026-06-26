const toCamel = (str: string) => str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

function keysToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(keysToCamel);

  if (obj !== null && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamel(key),
        keysToCamel(value),
      ])
    );
  }
  return obj;
}


const EXCLUDED_ROUTES: string[] = [];

export function camelCaseMiddleware(req: any, res: any, next: any) {
  if (new Set(EXCLUDED_ROUTES).has(req.path)) return next();

  const originalJson = res.json;
  res.json = function (data: any) {
    return originalJson.call(this, keysToCamel(data));
  };
  
  next();
}
