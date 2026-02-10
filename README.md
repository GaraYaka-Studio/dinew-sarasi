Web Management Console for Sarasi Class Management System built with Next.js

## Development

1. Clone the repository:

```bash
git clone https://github.com/GaraYaka-Studio/dinew-sarasi.git
cd dinew-sarasi
```

2. Install and initialize the dependencies:

```bash
npm install
npm run prepare
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Database

1. Create the `.env` file by coping the example
```sh
cp .env.example .env
```

2. Update the `DATABASE_URL` accordingly
```
DATABASE_URL="postgres://root:postgres_5432@localhost:5432/local"
```

3. Start the database (Docker only)
```sh
npm run db:start
```

4. Run the migrations
```sh
npm run db:migrate
```

5. Verify the migrations by running **Drizzle Studio**
```sh
npm run db:studio
```
