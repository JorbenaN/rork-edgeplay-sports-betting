```markdown
# EdgePlay IE 🎯  
Smart Bets, Sharper Minds – for IE Students

EdgePlay IE is an educational betting simulator for IE University students.  
It lets users place simple football (soccer) bets with virtual money, see leaderboards, and explore team statistics in a safe, data-driven environment — **no real money involved**. :contentReference[oaicite:0]{index=0}  

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## About the Project

**EdgePlay IE: A Smart Betting and Community App for IE Students** is a prototype created for the ADS course. :contentReference[oaicite:1]{index=1}  

The main goals are to:

- Help students **learn about probability, statistics, and responsible betting** in a controlled environment.
- Provide a **single place** to see matches, odds, and simulated bets instead of jumping between multiple websites. :contentReference[oaicite:2]{index=2}  
- Encourage **community and data literacy**, not gambling addiction or profit maximization. Bets are **simulated** and focused on learning. :contentReference[oaicite:3]{index=3}  

This repository contains the **core Python logic** for:

- Managing users and balances
- Simulating 1X2 bets on La Liga-style matches
- Ranking users by profit (leaderboard)
- Viewing basic team statistics

A separate **GUI layer was prototyped with Rork AI**, which helped generate and integrate the interface with these backend modules.

---

## Features

Current console prototype:

- 🔐 **Login as demo users**  
  Predefined users (e.g. `masih`, `abdelaziz`, `ahmed`, `javier`, `nikolozi`, `zhenyang`) each start with a virtual balance.   

- 🏆 **Leaderboard (Quicksort)**  
  Users are sorted by total profit using a custom quicksort implementation.   

- 🎲 **Place Bets (1X2)**  
  Users can place simple bets (Home win / Draw / Away win) on predefined matches with fixed odds and results. Bets update the user’s balance and betting history.   

- 📜 **Betting History**  
  Each user can view all past bets, including stake, outcome chosen, and whether it was won or lost.   

- 📊 **Team Statistics & Table (Selection Sort)**  
  A league table is computed from demo stats and sorted by points using **selection sort**, breaking ties alphabetically by team name. :contentReference[oaicite:8]{index=8}  

Planned (conceptual, from project design):

- Weekly budgets and usage alerts  
- Community features and AI-assisted predictions  
- More detailed stats and filters for teams and users :contentReference[oaicite:9]{index=9}  

---

## Built With

- **Language:** Python 3  
- **Paradigm:** Object-Oriented Programming (`User`, `Match`, `Bet` classes) :contentReference[oaicite:10]{index=10}  
- **Algorithms & Data Structures:**
  - Quicksort for user leaderboard by profit :contentReference[oaicite:11]{index=11}  
  - Selection sort for team standings by points :contentReference[oaicite:12]{index=12}  
  - In-memory dictionaries for users and matches :contentReference[oaicite:13]{index=13}  
- **Tools:**  
  - Rork AI – assisted with GUI generation and integration of these Python modules  
  - (Optional) Any IDE you used: VS Code / PyCharm / etc.

---

## Getting Started

These instructions let you run the **console version** of EdgePlay IE locally.

### Prerequisites

- Python **3.9+** installed  
- No external packages required (only Python standard library).

You can check your Python version with:

```bash
python --version
# or
python3 --version
````

### Installation

1. **Clone or download** this repository

   ```bash
   git clone https://github.com/your-username/edgeplay-ie.git
   cd edgeplay-ie
   ```

2. Make sure the core files are present:

   * `main.py`
   * `algorithms.py`
   * `data_store.py`
   * `models.py`

3. **Run the app**

   ```bash
   python main.py
   # or, on some systems:
   python3 main.py
   ```

---

## Usage

When you run `main.py`, you’ll see:

1. A list of available demo users (e.g. `masih`, `ahmed`, `javier`, etc.).
2. Type a username to log in (no password needed in this prototype).

On the **home screen**, you can:

* `1` – **Create a bet**

  * See all matches with odds.
  * Choose a match ID (e.g. `M1`).
  * Choose an outcome: `H` (home win), `D` (draw), `A` (away win).
  * Enter your stake (must be ≤ your balance).
  * The system settles the bet and updates your balance and history.

* `2` – **View my betting history**

  * Shows each bet, your chosen outcome, stake, and whether you won or lost. 

* `3` – **View matches**

  * Lists all matches with odds and final results.

* `4` – **Team statistics**

  * Displays a table of teams, games played, wins, draws, losses, and points, sorted by points using selection sort.

* `0` – **Logout / Exit**

After logging out, you can choose to log in again as another user or exit the program.

---

## Project Structure

```text
edgeplay-ie/
│
├─ main.py          # Entry point: CLI, menus, user interaction :contentReference[oaicite:19]{index=19}
├─ algorithms.py    # Quicksort (leaderboard), bet settlement, team stats, selection sort :contentReference[oaicite:20]{index=20}
├─ data_store.py    # In-memory demo data for users and matches :contentReference[oaicite:21]{index=21}
├─ models.py        # Core OOP models: User, Match, Bet :contentReference[oaicite:22]{index=22}
└─ docs/
   └─ ADS - Edgeplay IE.pdf   # Original project specification & inception deck :contentReference[oaicite:23]{index=23}
```


---

## Roadmap

* [ ] Add **weekly budget** limits and warnings for responsible use
* [ ] Store data persistently (e.g. JSON/SQLite) instead of in-memory
* [ ] Expand **GUI**: full navigation for login, bets, history, leaderboard, team stats
* [ ] Integrate real API-based stats (while keeping virtual money)
* [ ] Add simple **AI / rule-based predictions** and show them next to odds
* [ ] Implement user registration with IE email verification (conceptual requirement from project)

---

## License

This project is created **for educational purposes only** as part of a university course.
It is **not** a real-money gambling platform and should not be used as one.

You may adapt and reuse the code for learning, coursework, or personal projects.

---

## Contact

* **Team:** EdgePlay IE – ADS Project
* **Main contributors:** Javier Barrera, Ahmed Rachad Belloum, Masih Ghadbeygi, Abdelaziz Moumen, Zhengyang Rao Xu, Nikolozi Jorbenadze

(You can add your personal email and GitHub here, e.g.)

* **Your Name:** Nikolozi Jorbenadze
* **GitHub:** [@JorbenaN](https://github.com/your-username)
* **Email:** [njorbenadze.ieu2024@student.ie.edu](mailto:your.email@example.com)

---

## Acknowledgments

* **Rork AI** – for helping generate the GUI and integrate these Python modules into a visual interface.
* **Google Gemini AI** – for assisting in generating early mockups of the app’s design.
* **ADS course instructors** – for guidance on algorithms, data structures, and software design.
* **IE University classmates** – for feedback on the concept and user stories.

```

If you’d like, I can also add a short section describing *exactly* how to launch your Rork AI GUI once you tell me what command or file you use to start it.
::contentReference[oaicite:27]{index=27}
```
