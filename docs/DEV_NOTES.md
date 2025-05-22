
## Tipado fuerte Supabase
- `supabase gen types` corre en `postinstall` y escribe `src/lib/supabase-types.ts`.
- Al llamar `supabase.rpc`, casteamos la función a la key del mapa y
  los argumentos a su tipo exacto para obtener autocompletado y chequeo
  de tipos en tiempo de compilación.
- Si el CLI no está instalado en tu entorno CI/CD, el comando fallará,
  pero no detendrá `npm install` gracias al `|| echo ...`. Asegúrate de
  tener `supabase` CLI en local para regenerar tipos cuando cambie el
  esquema.
