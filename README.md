# Corte & Alma | Salão & Bem-Estar

Website oficial do salão Corte & Alma. Um refúgio de bem-estar e cabeleireiro artesanal em Lisboa.

## Tecnologias
- React 19
- Vite
- Tailwind CSS 4
- Motion (AnimatePresence)
- Lucide React (Ícones)

## Como correr localmente
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`

## Como publicar no Vercel
1. Ligue o seu repositório GitHub ao Vercel.
2. O Vercel detetará automaticamente as configurações de build.
3. Certifique-se de adicionar as seguintes variáveis de ambiente no Vercel:
   - `ADMIN_KEY`: Sua senha de administrador.
   - `SUPABASE_URL`: URL do seu projeto Supabase.
   - `SUPABASE_ANON_KEY`: Chave anónima do seu projeto Supabase.

## Configuração do Supabase (Para não perder dados)
1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No menu **SQL Editor**, execute o seguinte comando para criar a tabela de agendamentos:
   ```sql
   create table bookings (
     id text primary key,
     name text not null,
     email text,
     phone text not null,
     service text not null,
     date text not null,
     time text not null,
     status text default 'pending',
     "createdAt" timestamp with time zone default now()
   );
   ```
3. Copie o **Project URL** e a **API Key (anon/public)** para as variáveis de ambiente do Vercel.
