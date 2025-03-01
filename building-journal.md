# Building Journal

The following document is a journal of the building process of the casino-jackpot app.

## 1. Requirements

### General Requirements

- Build a slot machine game where players use credits to roll 3-block rows. Winning requires matching symbols, with server-side state management and dynamic “cheating” based on credits.
- **Session:** Create on app open with 10 credits.

### Game Mechanics

- **Roll Cost:** 1 credit per roll.
- **Display:** 1 row with 3 blocks.
- **Win Condition:** All blocks show the same symbol.
- **Symbols & Rewards:**
  - Cherry: +10 credits
  - Lemon: +20 credits
  - Orange: +30 credits
  - Watermelon: +40 credits

### Server-Side

- **State Management:** Keep session state on the server.
- **Roll Logic:**
  - **< 40 credits:** Pure randomness.
  - **40–60 credits:** For winning rolls, 30% chance to re-roll.
  - **> 60 credits:** For winning rolls, 60% chance to re-roll.
- **Cash Out:** Endpoint to transfer session credits to the user's account and close the session.

### Client-Side

- **UI:**
  - Minimal table with 3 blocks (use C, L, O, W for symbols).
  - A button to start the game.
- **Animation:**
  - On roll, all blocks show a spinning state (e.g., "X").
  - Reveal results sequentially: 1st block after 1s, 2nd after 2s, 3rd after 3s.
- **Credit Handling:**
  - **Win:** Increase credits by reward amount.
  - **Loss:** Deduct 1 credit.

## 2. Tech Stack

### Frontend

- **Language**: TypeScript. It is the best choice for the scale of this project and is the industry standard for frontend development
- **Next.js**: For a minimal table, it might be overkill, but it is a great choice due to its scalability and built-in SEO features
- **styling**: Tailwind CSS as a utility-first CSS framework and Shadcn UI for components (fast to develop and easy to customize)

### Backend

- **Language**: TypeScript/Node.js. It is a good enough choice for the current requirements and allows for fast development
- **Nest.js**: For this app, it might be overkill, but it’s the easiest way to build and maintain a scalable backend in the JS ecosystem + I personally like it
- **Database**: SQLite. It is an in-memory database (which is good for development purposes), and the app’s schema requires relationships between entities.
- **ORM**: Prisma. It is a great ORM that provides excellent DX, is easy to use, and I’m familiar with it. (Note: If I had more time, I would have tried Drizzle ORM.)

## 3. Architecture
